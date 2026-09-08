import { NextResponse } from "next/server";
import pg from "pg";

const { Client } = pg;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONNECT_TIMEOUT_MS = 30000;
const RETRY_COUNT = 2;
const RETRY_DELAY_MS = 2000;
const DEFAULT_LIMIT = Number(process.env.HOLOGRES_QUERY_LIMIT) || 10000;
const EXPORT_LIMIT = Number(process.env.HOLOGRES_EXPORT_LIMIT) || 100000;

function getRowLimit(searchParams) {
  const isExport = searchParams.get("export") === "1";
  return isExport ? EXPORT_LIMIT : DEFAULT_LIMIT;
}

function splitFilterValues(value) {
  return String(value)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeMatchType(match) {
  const normalized = (match || "exact").toLowerCase();
  if (
    normalized === "contains" ||
    normalized === "server" ||
    normalized === "exclude_exact" ||
    normalized === "exclude_contains"
  ) {
    return normalized;
  }
  return "exact";
}

function buildFilterConditions(filters) {
  const conditions = [];
  const queryParams = [];
  let paramIndex = 0;

  const nextParam = (value) => {
    paramIndex += 1;
    queryParams.push(value);
    return `$${paramIndex}`;
  };

  for (const filter of filters) {
    const column = filter.column;
    const values = splitFilterValues(filter.value);
    if (values.length === 0) continue;

    if (filter.match === "server") {
      const placeholder = nextParam(values[0]);
      conditions.push(
        `EXISTS (SELECT 1 FROM unnest(string_to_array("${column}"::text, ',')) AS t(token) WHERE trim(t.token) ILIKE ${placeholder})`
      );
      continue;
    }

    if (filter.match === "contains") {
      if (values.length === 1) {
        const placeholder = nextParam(`%${values[0]}%`);
        conditions.push(`"${column}"::text ILIKE ${placeholder}`);
      } else {
        const parts = values.map((value) => {
          const placeholder = nextParam(`%${value}%`);
          return `"${column}"::text ILIKE ${placeholder}`;
        });
        conditions.push(`(${parts.join(" OR ")})`);
      }
      continue;
    }

    if (filter.match === "exclude_contains") {
      const parts = values.map((value) => {
        const placeholder = nextParam(`%${value}%`);
        return `"${column}"::text NOT ILIKE ${placeholder}`;
      });
      conditions.push(`(${parts.join(" AND ")})`);
      continue;
    }

    if (filter.match === "exclude_exact") {
      const parts = values.map((value) => {
        const placeholder = nextParam(value);
        return `"${column}"::text <> ${placeholder}`;
      });
      conditions.push(`(${parts.join(" AND ")})`);
      continue;
    }

    const placeholder = nextParam(values[0]);
    conditions.push(`"${column}" = ${placeholder}`);
  }

  return { conditions, queryParams };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function serializeValue(value) {
  if (value == null) return value;
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return value.toString("base64");
  return value;
}

function serializeRows(rows) {
  return rows.map((row) => {
    const out = {};
    for (const [key, value] of Object.entries(row)) {
      out[key] = serializeValue(value);
    }
    return out;
  });
}

function buildHologresUser(raw) {
  if (!raw) return raw;
  return raw.includes("$marketing") ? raw : `${raw}$marketing`;
}

function buildHologresPassword(raw) {
  if (!raw) return raw;
  return raw.endsWith("$p") ? raw : `${raw}$p`;
}

function getPgConfig() {
  const uri = process.env.HOLOGRES_URI?.trim();
  if (uri) {
    return {
      connectionString: uri,
      connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
      ssl: false,
    };
  }

  const host = process.env.HOLOGRES_HOST;
  const user = buildHologresUser(process.env.HOLOGRES_USER);
  const password = buildHologresPassword(process.env.HOLOGRES_PASSWORD);
  const database = process.env.HOLOGRES_DATABASE || "postgres";
  const port = Number(process.env.HOLOGRES_PORT) || 80;

  if (!host || !user || !password) {
    return null;
  }

  return {
    host,
    port,
    user,
    password,
    database,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
    ssl: false,
  };
}

export async function GET(req) {
  try {
  const config = getPgConfig();

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Missing Hologres config. Set HOLOGRES_URI (or HOLOGRES_HOST, HOLOGRES_USER, HOLOGRES_PASSWORD) in environment variables.",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const columns = searchParams.getAll("column").map((c) => c?.trim()).filter(Boolean);
  const values = searchParams.getAll("value").map((v) => (v != null ? String(v).trim() : ""));
  const matches = searchParams.getAll("match").map((m) => (m || "exact").toLowerCase());

  const filters = [];
  for (let i = 0; i < columns.length; i++) {
    const val = values[i] ?? "";
    if (columns[i] && val !== "") {
      filters.push({
        column: columns[i],
        value: val,
        match: normalizeMatchType(matches[i]),
      });
    }
  }
  const hasFilter = filters.length > 0;
  const rowLimit = getRowLimit(searchParams);

  const allowedColumn = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  for (const f of filters) {
    if (!allowedColumn.test(f.column)) {
      return NextResponse.json(
        { error: `Invalid column name for filter: ${f.column}` },
        { status: 400 }
      );
    }
  }

  let lastError = null;
  for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
    const client = new Client(config);
    try {
      await client.connect();

      let queryText = "SELECT * FROM dmt.client_account_info";
      let queryParams = [];
      if (hasFilter) {
        const built = buildFilterConditions(filters);
        if (built.conditions.length > 0) {
          queryText += " WHERE " + built.conditions.join(" AND ");
        }
        queryParams = built.queryParams;
      }
      queryText += ` LIMIT ${rowLimit}`;

      const result = await client.query(
        queryParams.length ? { text: queryText, values: queryParams } : queryText
      );
      await client.end();

      const rows = serializeRows(result.rows);
      return NextResponse.json({
        rows,
        fields: result.fields?.map((f) => f.name) ?? [],
        limit: rowLimit,
        truncated: rows.length >= rowLimit,
      });
    } catch (err) {
      lastError = err;
      try {
        await client.end();
      } catch (_) {}
      const isDnsAgain = err.message && err.message.includes("EAI_AGAIN");
      if (isDnsAgain && attempt < RETRY_COUNT) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      break;
    }
  }

  const message = lastError?.message || "Query failed";
  const hint = message.includes("EAI_AGAIN")
    ? " DNS could not resolve the Hologres host from this network. Try: (1) Use the Public Endpoint from Hologres console and ensure your IP is whitelisted. (2) Run this app from a server in the same region (e.g. Alibaba Cloud ECS). (3) Or set HOLOGRES_URI with the full connection string from the console."
    : "";
  return NextResponse.json(
    { error: message + (hint ? ` ${hint}` : "") },
    { status: 500 }
  );
  } catch (err) {
    console.error("[client-account-info]", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
