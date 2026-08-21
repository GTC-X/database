"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import Header from "../header";
import Meta from "../components/Meta";
import * as XLSX from "xlsx";
import { isLoggedIn } from "../auth";

const COLUMN_LABELS = {
    first_name: "First name",
    last_name: "Last name",
    country: "Country",
    email: "Email",
    language: "Language",
    is_maxtech: "Is Maxtech",
    is_ts: "Is TS",
    maxtech_status: "Maxtech status",
    ts_status: "TS status",
    mt4_server: "MT4 server",
    mt5_server: "MT5 server",
    server_list: "Server list",
    update_time: "Update time",
    max_usertype: "Max Usertype",
    ts_usertype: "TS Usertype",
};

const COLUMN_HINTS = {
    email: "Partial email works — e.g. gmail.com",
    first_name: "First or last name",
    last_name: "First or last name",
    country: "Country name or code",
    server_list: "Pick exact server — MT4 won't match MT4_2",
    is_maxtech: "y = yes, n = no",
    is_ts: "y = yes, n = no",
    mt4_server: "y = yes, n = no",
    mt5_server: "y = yes, n = no",
    max_usertype: "e.g. Trader or Agent",
    maxtech_status: "Status text",
    ts_status: "Status text",
};

const FILTER_GROUPS = [
    {
        label: "Contact",
        columns: ["first_name", "last_name", "email", "country", "language"],
    },
    {
        label: "Platform & servers",
        columns: ["mt4_server", "mt5_server", "server_list"],
    },
    {
        label: "Account status",
        columns: ["is_maxtech", "is_ts", "maxtech_status", "ts_status", "max_usertype", "ts_usertype"],
    },
    { label: "Other", columns: ["update_time"] },
];

const YES_NO_COLUMNS = new Set(["is_maxtech", "is_ts", "mt4_server", "mt5_server"]);
const CONTAINS_DEFAULT_COLUMNS = new Set([
    "email",
    "first_name",
    "last_name",
    "country",
    "server_list",
    "maxtech_status",
    "ts_status",
    "max_usertype",
    "ts_usertype",
]);

const SERVER_GROUPS = [
    { label: "MT4 servers", servers: ["MT4", "MT4_2", "MT4_3"] },
    { label: "MT5 servers", servers: ["MT5", "MT5_2", "MT5_3", "MT5_4"] },
];

const ALL_SERVERS = SERVER_GROUPS.flatMap((g) => g.servers);

function getServerBadgeClass(server) {
    const s = server.toUpperCase();
    if (s.startsWith("MT5")) return "bg-amber-500/20 text-amber-200 border border-amber-500/40";
    if (s.startsWith("MT4")) return "bg-sky-500/20 text-sky-200 border border-sky-500/40";
    return "bg-gray-500/20 text-gray-300 border border-gray-500/40";
}

const QUICK_FILTERS = [
    {
        label: "MT5 enabled",
        description: "Clients with MT5 server",
        filters: [{ column: "mt5_server", value: "y", match: "exact" }],
    },
    {
        label: "MT4 enabled",
        description: "Clients with MT4 server",
        filters: [{ column: "mt4_server", value: "y", match: "exact" }],
    },
    {
        label: "Maxtech",
        description: "Maxtech accounts",
        filters: [{ column: "is_maxtech", value: "y", match: "exact" }],
    },
    {
        label: "Trading Studio",
        description: "TS accounts",
        filters: [{ column: "is_ts", value: "y", match: "exact" }],
    },
    {
        label: "Traders",
        description: "Max Usertype = Trader",
        filters: [{ column: "max_usertype", value: "Trader", match: "contains" }],
    },
];

const DEFAULT_VISIBLE = new Set([
    "first_name",
    "last_name",
    "email",
    "country",
    "is_maxtech",
    "is_ts",
    "mt4_server",
    "mt5_server",
    "server_list",
    "max_usertype",
    "update_time",
]);

const PAGE_SIZE = 20;

function getColumnLabel(col) {
    return COLUMN_LABELS[col] ?? col.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function defaultMatchForColumn(column) {
    if (column === "server_list") return "server";
    if (YES_NO_COLUMNS.has(column)) return "exact";
    if (CONTAINS_DEFAULT_COLUMNS.has(column)) return "contains";
    return "exact";
}

function getFilterPlaceholder(column) {
    return COLUMN_HINTS[column] || "Enter value…";
}

function getPaginationItems(currentPageOneBased, totalPages, siblingCount = 1) {
    if (totalPages <= 1) return [];
    const current = Math.max(1, Math.min(currentPageOneBased, totalPages));
    const pages = new Set([1, totalPages]);
    for (let i = Math.max(1, current - siblingCount); i <= Math.min(totalPages, current + siblingCount); i++) {
        pages.add(i);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
        result.push(sorted[i]);
    }
    return result;
}

function formatDate(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function YesNoBadge({ value }) {
    const normalized = String(value).toLowerCase();
    const isYes = normalized === "y" || normalized === "yes" || normalized === "true" || normalized === "1";
    const isNo = normalized === "n" || normalized === "no" || normalized === "false" || normalized === "0";
    if (!isYes && !isNo) return <span>{String(value)}</span>;
    return (
        <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                isYes ? "bg-emerald-500/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"
            }`}
        >
            {isYes ? "Yes" : "No"}
        </span>
    );
}

function ServerListBadges({ value }) {
    const servers = String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (servers.length === 0) return <span>—</span>;
    return (
        <div className="flex flex-wrap gap-1">
            {servers.map((server) => (
                <span
                    key={server}
                    className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${getServerBadgeClass(server)}`}
                    title={server.startsWith("MT4") ? "MT4 platform server" : server.startsWith("MT5") ? "MT5 platform server" : server}
                >
                    {server}
                </span>
            ))}
        </div>
    );
}

function CellValue({ column, value }) {
    if (value == null || value === "") return <span className="text-gray-500">—</span>;
    if (YES_NO_COLUMNS.has(column)) return <YesNoBadge value={value} />;
    if (column === "server_list") return <ServerListBadges value={value} />;
    if (column === "update_time") return <span>{formatDate(value)}</span>;
    if (column === "email") {
        return <span className="font-medium text-white">{String(value)}</span>;
    }
    return <span>{String(value)}</span>;
}

export default function ClientAccountDashboard() {
    const router = useRouter();
    const [accountData, setAccountData] = useState({
        rows: [],
        fields: [],
        loading: false,
        error: null,
        hasLoaded: false,
    });
    const [filters, setFilters] = useState([{ column: "email", value: "", match: "contains" }]);
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [quickSearch, setQuickSearch] = useState("");
    const [exportColumns, setExportColumns] = useState(new Set());
    const [exportPanelOpen, setExportPanelOpen] = useState(false);
    const [columnsPanelOpen, setColumnsPanelOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(null);
    const hasInitializedExportRef = useRef(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [helpOpen, setHelpOpen] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!isLoggedIn()) {
            router.replace("/");
            return;
        }
        setAuthChecked(true);
    }, [router]);

    useEffect(() => {
        if (accountData.fields.length > 0 && !hasInitializedExportRef.current) {
            hasInitializedExportRef.current = true;
            setExportColumns(new Set(accountData.fields));
            if (!visibleColumns) {
                const initial = accountData.fields.filter((f) => DEFAULT_VISIBLE.has(f));
                setVisibleColumns(new Set(initial.length > 0 ? initial : accountData.fields));
            }
        }
    }, [accountData.fields, visibleColumns]);

    const displayFields = accountData.fields.filter((col) =>
        visibleColumns ? visibleColumns.has(col) : true
    );

    const toggleVisibleColumn = (col) => {
        setVisibleColumns((prev) => {
            const base = prev ? new Set(prev) : new Set(accountData.fields);
            if (base.has(col)) base.delete(col);
            else base.add(col);
            return base;
        });
    };

    const showAllColumns = () => setVisibleColumns(new Set(accountData.fields));
    const showDefaultColumns = () => {
        const defaults = accountData.fields.filter((f) => DEFAULT_VISIBLE.has(f));
        setVisibleColumns(new Set(defaults.length > 0 ? defaults : accountData.fields));
    };

    const toggleExportColumn = (col) => {
        setExportColumns((prev) => {
            const next = new Set(prev);
            if (next.has(col)) next.delete(col);
            else next.add(col);
            return next;
        });
    };

    const selectAllExportColumns = () => setExportColumns(new Set(accountData.fields));
    const clearAllExportColumns = () => setExportColumns(new Set());

    const handleExportExcel = () => {
        const cols = accountData.fields.filter((c) => exportColumns.has(c));
        if (cols.length === 0) return;
        const headers = cols.map((c) => getColumnLabel(c));
        const data = accountData.rows.map((row) => {
            const obj = {};
            cols.forEach((c, i) => {
                obj[headers[i]] = row[c] != null ? row[c] : "";
            });
            return obj;
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Client Account Info");
        XLSX.writeFile(wb, "client-account-info.xlsx");
        setExportPanelOpen(false);
    };

    const fetchData = useCallback(async (filterList) => {
        setAccountData((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const params = new URLSearchParams();
            const active = (filterList || []).filter(
                (f) => f.column && f.value !== null && String(f.value).trim() !== ""
            );
            active.forEach((f) => {
                params.append("column", f.column);
                params.append("value", String(f.value).trim());
                params.append("match", f.match || "exact");
            });
            const query = params.toString();
            const res = await fetch(
                `/api/client-account-info${query ? `?${query}` : ""}`,
                { cache: "no-store" }
            );
            const contentType = res.headers.get("content-type") || "";
            let data;
            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(
                    res.ok
                        ? "Server returned an unexpected response format."
                        : `Server error (${res.status}). ${text.slice(0, 200)}`
                );
            }
            if (!res.ok) {
                setAccountData((prev) => ({
                    ...prev,
                    rows: [],
                    fields: prev.fields.length ? prev.fields : [],
                    loading: false,
                    error: data.error || "Failed to load data",
                    hasLoaded: true,
                }));
                return;
            }
            setAccountData({
                rows: data.rows || [],
                fields: data.fields || [],
                loading: false,
                error: null,
                hasLoaded: true,
            });
            setPageIndex(0);
        } catch (e) {
            setAccountData((prev) => ({
                ...prev,
                loading: false,
                error: e.message || "Failed to fetch",
                hasLoaded: true,
            }));
        }
    }, []);

    const runFilters = (filterList) => {
        const activeFilters = (filterList || []).filter(
            (f) => f.column && String(f.value).trim() !== ""
        );
        setAppliedFilters(activeFilters);
        fetchData(activeFilters);
    };

    const updateFilter = (index, field, value) => {
        setFilters((prev) =>
            prev.map((f, i) => {
                if (i !== index) return f;
                const next = { ...f, [field]: value };
                if (field === "column" && value) {
                    next.match = defaultMatchForColumn(value);
                    if (value !== f.column) next.value = "";
                }
                return next;
            })
        );
    };

    const addFilter = () => {
        setFilters((prev) => [...prev, { column: "email", value: "", match: "contains" }]);
    };

    const removeFilter = (index) => {
        setFilters((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
    };

    const handleApplyFilter = (e) => {
        e?.preventDefault();
        runFilters(filters);
    };

    const handleQuickSearch = (e) => {
        e?.preventDefault();
        const term = quickSearch.trim();
        if (!term) return;
        const quickFilters = [{ column: "email", value: term, match: "contains" }];
        setFilters(quickFilters);
        runFilters(quickFilters);
    };

    const handleQuickFilter = (preset) => {
        setFilters(preset.filters);
        runFilters(preset.filters);
    };

    const handleServerFilter = (server) => {
        if (!server) return;
        const serverFilters = [{ column: "server_list", value: server, match: "server" }];
        setFilters(serverFilters);
        runFilters(serverFilters);
    };

    const formatMatchLabel = (match) => {
        if (match === "contains") return " ∋ ";
        if (match === "server") return " has server ";
        return " = ";
    };

    const handleLoadAll = () => {
        const empty = [{ column: "email", value: "", match: "contains" }];
        setFilters(empty);
        setAppliedFilters([]);
        setQuickSearch("");
        fetchData([]);
    };

    const handleClearFilter = () => {
        setFilters([{ column: "email", value: "", match: "contains" }]);
        setAppliedFilters([]);
        setQuickSearch("");
        setAccountData({ rows: [], fields: [], loading: false, error: null, hasLoaded: false });
        hasInitializedExportRef.current = false;
        setVisibleColumns(null);
    };

    const removeAppliedFilter = (index) => {
        const next = appliedFilters.filter((_, i) => i !== index);
        setAppliedFilters(next);
        setFilters(next.length > 0 ? next : [{ column: "email", value: "", match: "contains" }]);
        if (next.length > 0) {
            fetchData(next);
        } else {
            setAccountData((prev) => ({ ...prev, rows: [], hasLoaded: false }));
        }
    };

    const hasActiveFilters = appliedFilters.length > 0;
    const totalRows = accountData.rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
    const startItem = totalRows === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
    const endItem = Math.min((pageIndex + 1) * PAGE_SIZE, totalRows);
    const paginatedRows = accountData.rows.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-[#0F143A] flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#B48755] border-t-transparent" />
            </div>
        );
    }

    return (
        <>
            <Meta
                title="Client Account Info - GTCFX"
                description="Search and filter client account records from Hologres."
            />
            <div className="min-h-screen bg-[#0F143A] text-white">
                <Header />
                <section className="mx-auto max-w-7xl px-4 py-10">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Client Account Info
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Search clients by email, server, platform, or account type.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setHelpOpen((o) => !o)}
                            className="self-start rounded-lg border border-[#293794] px-4 py-2 text-sm text-gray-300 hover:bg-[#293794]/40"
                        >
                            {helpOpen ? "Hide guide" : "How to use"}
                        </button>
                    </div>

                    {helpOpen && (
                        <div className="mb-6 rounded-xl border border-[#B48755]/30 bg-[#B48755]/10 p-4 text-sm text-gray-200">
                            <p className="mb-2 font-semibold text-[#B48755]">Quick start</p>
                            <ul className="list-inside list-disc space-y-1 text-gray-300">
                                <li>Use <strong className="text-white">Quick search</strong> to find by email (partial match).</li>
                                <li>Click a <strong className="text-white">Quick filter</strong> preset for common queries (MT5, Maxtech, etc.).</li>
                                <li>Add multiple filters — all conditions must match (AND logic).</li>
                                <li><strong className="text-white">MT4 server</strong> / <strong className="text-white">MT5 server</strong> = yes/no for any MT4 or MT5 access.</li>
                                <li><strong className="text-white">Server list</strong> = exact servers assigned (e.g. MT4, MT4_2, MT5_3). Blue = MT4, amber = MT5.</li>
                                <li>Use <strong className="text-white">Filter by server</strong> to target one server exactly — MT4 will not match MT4_2.</li>
                                <li><strong className="text-white">Load all</strong> fetches up to 10,000 records (may be slow).</li>
                            </ul>
                        </div>
                    )}

                    {/* Quick search */}
                    <div className="mb-4 rounded-xl border border-[#293794]/80 bg-[#1a1f4a]/60 p-4">
                        <form onSubmit={handleQuickSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1 space-y-1">
                                <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                    Quick search by email
                                </label>
                                <input
                                    type="text"
                                    value={quickSearch}
                                    onChange={(e) => setQuickSearch(e.target.value)}
                                    placeholder="Type part of an email — e.g. gmail.com or john@"
                                    className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!quickSearch.trim() || accountData.loading}
                                className="rounded-lg bg-[#B48755] px-5 py-2.5 font-semibold text-white transition hover:bg-[#c99a66] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={handleLoadAll}
                                disabled={accountData.loading}
                                className="rounded-lg border border-[#293794] bg-[#0F143A] px-5 py-2.5 font-medium text-gray-300 transition hover:bg-[#293794] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Load all
                            </button>
                        </form>
                    </div>

                    {/* Server-specific filter */}
                    <div className="mb-4 rounded-xl border border-[#293794]/80 bg-[#1a1f4a]/60 p-4">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                            <div className="space-y-1">
                                <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                    Filter by specific server
                                </label>
                                <p className="text-xs text-gray-500">
                                    Exact match — MT4, MT4_2, and MT4_3 are treated separately.
                                </p>
                            </div>
                            <div className="ml-auto flex items-center gap-3 text-xs">
                                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-sky-200">MT4</span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-200">MT5</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <select
                                defaultValue=""
                                onChange={(e) => {
                                    handleServerFilter(e.target.value);
                                    e.target.value = "";
                                }}
                                disabled={accountData.loading}
                                className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none sm:max-w-xs"
                            >
                                <option value="">Choose server…</option>
                                {SERVER_GROUPS.map((group) => (
                                    <optgroup key={group.label} label={group.label}>
                                        {group.servers.map((server) => (
                                            <option key={server} value={server}>
                                                {server}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <div className="flex flex-wrap gap-2">
                                {ALL_SERVERS.map((server) => (
                                    <button
                                        key={server}
                                        type="button"
                                        title={`Show clients on ${server} only`}
                                        onClick={() => handleServerFilter(server)}
                                        disabled={accountData.loading}
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition hover:opacity-90 disabled:opacity-50 ${getServerBadgeClass(server)}`}
                                    >
                                        {server}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick filter presets */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <span className="self-center text-xs font-medium uppercase tracking-wider text-gray-500">
                            Quick filters:
                        </span>
                        {QUICK_FILTERS.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                title={preset.description}
                                onClick={() => handleQuickFilter(preset)}
                                disabled={accountData.loading}
                                className="rounded-full border border-[#293794] bg-[#1a1f4a]/80 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-[#B48755] hover:text-[#B48755] disabled:opacity-50"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Advanced filters */}
                    <div className="mb-6 rounded-xl border border-[#293794]/80 bg-[#1a1f4a]/60 p-4 shadow-lg backdrop-blur sm:p-5">
                        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                            Advanced filters
                        </p>
                        <form onSubmit={handleApplyFilter} className="space-y-4">
                            {filters.map((filter, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-3 rounded-lg border border-[#293794]/50 bg-[#0F143A]/40 p-3 sm:flex-row sm:items-end sm:gap-4"
                                >
                                    <div className="flex-1 space-y-1 sm:min-w-[160px]">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                            Field
                                        </label>
                                        <select
                                            value={filter.column}
                                            onChange={(e) => updateFilter(index, "column", e.target.value)}
                                            className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                        >
                                            <option value="">Select field…</option>
                                            {FILTER_GROUPS.map((group) => (
                                                <optgroup key={group.label} label={group.label}>
                                                    {group.columns.map((col) => (
                                                        <option key={col} value={col}>
                                                            {getColumnLabel(col)}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                            Value
                                        </label>
                                        {YES_NO_COLUMNS.has(filter.column) ? (
                                            <select
                                                value={filter.value}
                                                onChange={(e) => updateFilter(index, "value", e.target.value)}
                                                className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                            >
                                                <option value="">Select…</option>
                                                <option value="y">Yes (y)</option>
                                                <option value="n">No (n)</option>
                                            </select>
                                        ) : filter.column === "server_list" ? (
                                            <select
                                                value={filter.value}
                                                onChange={(e) => updateFilter(index, "value", e.target.value)}
                                                className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                            >
                                                <option value="">Select server…</option>
                                                {SERVER_GROUPS.map((group) => (
                                                    <optgroup key={group.label} label={group.label}>
                                                        {group.servers.map((server) => (
                                                            <option key={server} value={server}>
                                                                {server}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={filter.value}
                                                onChange={(e) => updateFilter(index, "value", e.target.value)}
                                                placeholder={getFilterPlaceholder(filter.column)}
                                                className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-1 sm:min-w-[120px]">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                            Match
                                        </label>
                                        <select
                                            value={filter.match}
                                            onChange={(e) => updateFilter(index, "match", e.target.value)}
                                            disabled={YES_NO_COLUMNS.has(filter.column) || filter.column === "server_list"}
                                            className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755] disabled:opacity-60"
                                        >
                                            <option value="exact">Exact match</option>
                                            <option value="contains">Contains</option>
                                            <option value="server">Exact server</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => removeFilter(index)}
                                            disabled={filters.length <= 1}
                                            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={addFilter}
                                    className="rounded-lg border border-dashed border-[#B48755]/60 bg-[#B48755]/10 px-4 py-2.5 text-sm font-medium text-[#B48755] transition hover:bg-[#B48755]/20"
                                >
                                    + Add filter
                                </button>
                                <button
                                    type="submit"
                                    disabled={accountData.loading}
                                    className="rounded-lg bg-[#B48755] px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#c99a66] disabled:opacity-50"
                                >
                                    Apply filters
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilter}
                                    className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-5 py-2.5 font-medium text-gray-300 transition hover:bg-[#293794] hover:text-white"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>

                        {hasActiveFilters && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-gray-500">Active:</span>
                                {appliedFilters.map((f, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => removeAppliedFilter(i)}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#293794]/60 px-3 py-1 text-[#B48755] transition hover:bg-[#293794]"
                                        title="Click to remove this filter"
                                    >
                                        <strong className="text-white">{getColumnLabel(f.column)}</strong>
                                        {formatMatchLabel(f.match)}
                                        &quot;{f.value}&quot;
                                        <span className="ml-1 text-gray-400">×</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Toolbar */}
                    {(accountData.hasLoaded || accountData.loading) && (
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm text-gray-400">
                                {accountData.loading
                                    ? "Loading…"
                                    : totalRows === 0
                                      ? "No matching records"
                                      : `Showing ${startItem}–${endItem} of ${totalRows} record${totalRows !== 1 ? "s" : ""}`}
                                {totalPages > 1 && !accountData.loading && (
                                    <span className="ml-2 text-[#B48755]">
                                        (page {pageIndex + 1} of {totalPages})
                                    </span>
                                )}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setColumnsPanelOpen((o) => !o)}
                                    className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-4 py-2 text-sm text-gray-300 hover:bg-[#293794]"
                                >
                                    Columns ({displayFields.length}/{accountData.fields.length})
                                </button>
                                {accountData.rows.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setExportPanelOpen((o) => !o)}
                                        className="rounded-lg bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                                    >
                                        Export Excel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {columnsPanelOpen && accountData.fields.length > 0 && (
                        <div className="mb-4 rounded-lg border border-[#293794] bg-[#1a1f4a]/80 p-4">
                            <div className="mb-3 flex flex-wrap gap-3">
                                <button type="button" onClick={showAllColumns} className="text-xs text-[#B48755] hover:underline">
                                    Show all
                                </button>
                                <button type="button" onClick={showDefaultColumns} className="text-xs text-gray-400 hover:underline">
                                    Default view
                                </button>
                            </div>
                            <div className="flex max-h-40 flex-wrap gap-x-4 gap-y-2 overflow-y-auto">
                                {accountData.fields.map((col) => (
                                    <label key={col} className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns?.has(col) ?? true}
                                            onChange={() => toggleVisibleColumn(col)}
                                            className="h-4 w-4 rounded border-[#293794] bg-[#0F143A] text-[#B48755]"
                                        />
                                        {getColumnLabel(col)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {exportPanelOpen && accountData.rows.length > 0 && (
                        <div className="mb-4 rounded-lg border border-[#293794] bg-[#1a1f4a]/80 p-4">
                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                Select columns to export
                            </p>
                            <div className="mb-3 flex flex-wrap gap-2">
                                <button type="button" onClick={selectAllExportColumns} className="text-xs text-emerald-400 hover:underline">
                                    Select all
                                </button>
                                <span className="text-gray-600">|</span>
                                <button type="button" onClick={clearAllExportColumns} className="text-xs text-gray-400 hover:underline">
                                    Deselect all
                                </button>
                            </div>
                            <div className="mb-4 flex max-h-32 flex-wrap gap-x-4 gap-y-2 overflow-y-auto">
                                {accountData.fields.map((col) => (
                                    <label key={col} className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
                                        <input
                                            type="checkbox"
                                            checked={exportColumns.has(col)}
                                            onChange={() => toggleExportColumn(col)}
                                            className="h-4 w-4 rounded border-[#293794] bg-[#0F143A] text-[#B48755]"
                                        />
                                        {getColumnLabel(col)}
                                    </label>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleExportExcel}
                                disabled={exportColumns.size === 0}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                            >
                                Export ({exportColumns.size} columns)
                            </button>
                        </div>
                    )}

                    {accountData.loading && (
                        <div className="flex items-center justify-center rounded-xl border border-[#293794] bg-[#1a1f4a]/40 py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#B48755] border-t-transparent" />
                                <p className="text-gray-400">Fetching records…</p>
                            </div>
                        </div>
                    )}

                    {accountData.error && (
                        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-300">
                            {accountData.error}
                        </div>
                    )}

                    {!accountData.loading && !accountData.hasLoaded && (
                        <div className="rounded-xl border border-dashed border-[#293794] bg-[#1a1f4a]/30 px-6 py-16 text-center">
                            <p className="text-lg font-medium text-gray-300">No data loaded yet</p>
                            <p className="mt-2 text-sm text-gray-500">
                                Use Quick search, a Quick filter preset, or Advanced filters to load client records.
                            </p>
                        </div>
                    )}

                    {!accountData.loading && accountData.hasLoaded && (
                        <div className="overflow-hidden rounded-xl border border-[#293794] bg-[#1a1f4a]/40 shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[#293794] bg-[#0F143A]/80">
                                            {displayFields.map((col) => (
                                                <th
                                                    key={col}
                                                    className="px-4 py-3.5 font-semibold text-[#B48755] whitespace-nowrap"
                                                    title={COLUMN_HINTS[col] || col}
                                                >
                                                    {getColumnLabel(col)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accountData.rows.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={Math.max(displayFields.length, 1)}
                                                    className="px-4 py-12 text-center text-gray-500"
                                                >
                                                    No records match your filters. Try a different value or clear filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedRows.map((row, i) => (
                                                <tr
                                                    key={pageIndex * PAGE_SIZE + i}
                                                    className="border-b border-[#293794]/40 transition hover:bg-[#293794]/30"
                                                >
                                                    {displayFields.map((col) => (
                                                        <td
                                                            key={col}
                                                            className={
                                                                col === "server_list"
                                                                    ? "min-w-[200px] max-w-[360px] px-4 py-3"
                                                                    : "max-w-[240px] truncate px-4 py-3"
                                                            }
                                                            title={String(row[col] ?? "")}
                                                        >
                                                            <CellValue column={col} value={row[col]} />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex flex-wrap items-center justify-center gap-1 border-t border-[#293794]/40 px-2 py-3 sm:gap-2 sm:px-4">
                                    <button
                                        type="button"
                                        onClick={() => setPageIndex(0)}
                                        disabled={pageIndex === 0}
                                        className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-2 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#293794] disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                                    >
                                        First
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                                        disabled={pageIndex === 0}
                                        className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-2 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#293794] disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                                    >
                                        Prev
                                    </button>
                                    <div className="mx-1 flex items-center gap-0.5 sm:gap-1">
                                        {getPaginationItems(pageIndex + 1, totalPages, 1).map((item, i) =>
                                            item === "…" ? (
                                                <span key={`ellipsis-${i}`} className="px-1 py-1 text-sm text-gray-500">
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => setPageIndex(item - 1)}
                                                    className={`min-w-[28px] rounded-lg border px-1.5 py-1.5 text-xs font-medium sm:min-w-[36px] sm:px-2 sm:py-2 sm:text-sm ${
                                                        pageIndex + 1 === item
                                                            ? "border-[#B48755] bg-[#B48755] text-white"
                                                            : "border-[#293794] bg-[#1a1f4a] text-gray-300 hover:bg-[#293794]"
                                                    }`}
                                                >
                                                    {item}
                                                </button>
                                            )
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                                        disabled={pageIndex >= totalPages - 1}
                                        className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-2 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#293794] disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                                    >
                                        Next
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPageIndex(totalPages - 1)}
                                        disabled={pageIndex >= totalPages - 1}
                                        className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-2 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#293794] disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                                    >
                                        Last
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
