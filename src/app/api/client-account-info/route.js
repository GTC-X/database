import { NextResponse } from "next/server";
import pg from "pg";

const { Client } = pg;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONNECT_TIMEOUT_MS = 30000;
const RETRY_COUNT = 2;
const RETRY_DELAY_MS = 2000;
const MAX_ROWS = 10000;

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
        match: matches[i] === "contains" ? "contains" : "exact",
      });
    }
  }
  const hasFilter = filters.length > 0;

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
      const queryParams = [];
      if (hasFilter) {
        const conditions = [];
        filters.forEach((f, i) => {
          if (f.match === "contains") {
            conditions.push(`"${f.column}"::text ILIKE $${i + 1}`);
            queryParams.push(`%${f.value}%`);
          } else {
            conditions.push(`"${f.column}" = $${i + 1}`);
            queryParams.push(f.value);
          }
        });
        queryText += " WHERE " + conditions.join(" AND ");
      }
      queryText += ` LIMIT ${MAX_ROWS}`;

      const result = await client.query(
        queryParams.length ? { text: queryText, values: queryParams } : queryText
      );
      await client.end();

      return NextResponse.json({
        rows: serializeRows(result.rows),
        fields: result.fields?.map((f) => f.name) ?? [],
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
