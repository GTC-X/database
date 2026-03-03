"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
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
    update_time: "Update time",
};

function getColumnLabel(col) {
    return COLUMN_LABELS[col] ?? col.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GTCRegisterWithDesign() {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [accountData, setAccountData] = useState({
        rows: [],
        fields: [],
        loading: true,
        error: null,
    });
    const [filters, setFilters] = useState([{ column: "", value: "", match: "exact" }]);
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [exportColumns, setExportColumns] = useState(new Set());
    const [exportPanelOpen, setExportPanelOpen] = useState(false);
    const hasInitializedExportRef = useRef(false);
    const [authChecked, setAuthChecked] = useState(false);
    const t = useTranslations("home.banner");

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
        }
    }, [accountData.fields]);

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
            const res = await fetch(
                `/api/client-account-info?${params.toString()}`,
                { cache: "no-store" }
            );
            const data = await res.json();
            if (!res.ok) {
                setAccountData((prev) => ({
                    ...prev,
                    rows: [],
                    fields: prev.fields.length ? prev.fields : [],
                    loading: false,
                    error: data.error || "Failed to load data",
                }));
                return;
            }
            setAccountData({
                rows: data.rows || [],
                fields: data.fields || [],
                loading: false,
                error: null,
            });
        } catch (e) {
            setAccountData((prev) => ({
                ...prev,
                loading: false,
                error: e.message || "Failed to fetch",
            }));
        }
    }, []);

    useEffect(() => {
        fetchData(appliedFilters);
    }, [appliedFilters, fetchData]);

    const updateFilter = (index, field, value) => {
        setFilters((prev) => {
            const next = prev.map((f, i) =>
                i === index ? { ...f, [field]: value } : f
            );
            return next;
        });
    };

    const addFilter = () => {
        setFilters((prev) => [...prev, { column: "", value: "", match: "exact" }]);
    };

    const removeFilter = (index) => {
        setFilters((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
    };

    const handleApplyFilter = (e) => {
        e?.preventDefault();
        setAppliedFilters(
            filters.filter((f) => f.column && String(f.value).trim() !== "")
        );
    };

    const handleClearFilter = () => {
        setFilters([{ column: "", value: "", match: "exact" }]);
        setAppliedFilters([]);
    };

    const hasActiveFilters = appliedFilters.length > 0;

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-[#0F143A] flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#B48755] border-t-transparent" />
            </div>
        );
    }

    return (
        <>
            <Meta title="Get 5,000 USC to Trade. No Deposit Needed!" description="Fill in your details, activate your GTC Cent trading account, and start trading with a 5,000 USC bonus today." />
            <div className="min-h-screen bg-[#0F143A] text-white">
                <Header />
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Client Account Info
                        </h2>
                        <p className="text-sm text-gray-400">
                            Table: dmt.client_account_info
                        </p>
                    </div>

                    {/* Filter bar */}
                    <div className="mb-6 rounded-xl border border-[#293794]/80 bg-[#1a1f4a]/60 p-4 shadow-lg backdrop-blur sm:p-5">
                        <form onSubmit={handleApplyFilter} className="space-y-4">
                            {filters.map((filter, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-3 rounded-lg border border-[#293794]/50 bg-[#0F143A]/40 p-3 sm:flex-row sm:items-end sm:gap-4"
                                >
                                    <div className="flex-1 space-y-1 sm:min-w-[140px]">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                            Column
                                        </label>
                                        <select
                                            value={filter.column}
                                            onChange={(e) => updateFilter(index, "column", e.target.value)}
                                            className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                        >
                                            <option value="">Select column</option>
                                            {accountData.fields.map((col) => (
                                                <option key={col} value={col}>
                                                    {getColumnLabel(col)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                            Value
                                        </label>
                                        <input
                                            type="text"
                                            value={filter.value}
                                            onChange={(e) => updateFilter(index, "value", e.target.value)}
                                            placeholder="Filter value..."
                                            className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:min-w-[100px]">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                            Match
                                        </label>
                                        <select
                                            value={filter.match}
                                            onChange={(e) => updateFilter(index, "match", e.target.value)}
                                            className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-2.5 text-white focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                                        >
                                            <option value="exact">Exact</option>
                                            <option value="contains">Contains</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => removeFilter(index)}
                                            disabled={filters.length <= 1}
                                            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                            title={filters.length <= 1 ? "Keep at least one filter row" : "Remove filter"}
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
                                    className="rounded-lg bg-[#B48755] px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#c99a66] focus:outline-none focus:ring-2 focus:ring-[#B48755] focus:ring-offset-2 focus:ring-offset-[#0F143A]"
                                >
                                    Apply filters
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilter}
                                    className="rounded-lg border border-[#293794] bg-[#1a1f4a] px-5 py-2.5 font-medium text-gray-300 transition hover:bg-[#293794] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#293794]"
                                >
                                    Clear all
                                </button>
                            </div>
                        </form>
                        {hasActiveFilters && (
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                                <span className="text-[#B48755]">Active filters:</span>
                                {appliedFilters.map((f, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#293794]/60 px-3 py-1 text-[#B48755]"
                                    >
                                        <strong className="text-white">{getColumnLabel(f.column)}</strong>
                                        {f.match === "contains" ? " contains " : " = "}
                                        &quot;{f.value}&quot;
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {accountData.rows.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-[#293794]/40 bg-[#0F143A]/50 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">
                                    Showing {accountData.rows.length} row{accountData.rows.length !== 1 ? "s" : ""}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setExportPanelOpen((o) => !o)}
                                        className="rounded-lg bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0F143A]"
                                    >
                                        Export to Excel
                                    </button>
                                </div>
                            </div>
                            {exportPanelOpen && (
                                <div className="rounded-lg border border-[#293794] bg-[#1a1f4a]/80 p-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#B48755]">
                                        Select columns to export
                                    </p>
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={selectAllExportColumns}
                                            className="text-xs text-emerald-400 hover:underline"
                                        >
                                            Select all
                                        </button>
                                        <span className="text-gray-600">|</span>
                                        <button
                                            type="button"
                                            onClick={clearAllExportColumns}
                                            className="text-xs text-gray-400 hover:underline"
                                        >
                                            Deselect all
                                        </button>
                                    </div>
                                    <div className="mb-4 flex max-h-32 flex-wrap gap-x-4 gap-y-2 overflow-y-auto">
                                        {accountData.fields.map((col) => (
                                            <label
                                                key={col}
                                                className="flex cursor-pointer items-center gap-2 text-sm text-gray-200"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={exportColumns.has(col)}
                                                    onChange={() => toggleExportColumn(col)}
                                                    className="h-4 w-4 rounded border-[#293794] bg-[#0F143A] text-[#B48755] focus:ring-[#B48755]"
                                                />
                                                {getColumnLabel(col)}
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleExportExcel}
                                        disabled={exportColumns.size === 0}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Export ({exportColumns.size} column{exportColumns.size !== 1 ? "s" : ""})
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {accountData.loading && (
                        <div className="flex items-center justify-center rounded-xl border border-[#293794] bg-[#1a1f4a]/40 py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#B48755] border-t-transparent" />
                                <p className="text-gray-400">Loading...</p>
                            </div>
                        </div>
                    )}
                    {accountData.error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-300">
                            {accountData.error}
                        </div>
                    )}
                    {!accountData.loading && !accountData.error && (
                        <div className="overflow-hidden rounded-xl border border-[#293794] bg-[#1a1f4a]/40 shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[#293794] bg-[#0F143A]/80">
                                            {accountData.fields.map((col) => (
                                                <th
                                                    key={col}
                                                    className="px-4 py-3.5 font-semibold text-[#B48755] whitespace-nowrap"
                                                    title={col}
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
                                                    colSpan={accountData.fields.length}
                                                    className="px-4 py-12 text-center text-gray-500"
                                                >
                                                    No rows found. Try changing or clearing the filter.
                                                </td>
                                            </tr>
                                        ) : (
                                            accountData.rows.map((row, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b border-[#293794]/40 transition hover:bg-[#293794]/30"
                                                >
                                                    {accountData.fields.map((col) => (
                                                        <td
                                                            key={col}
                                                            className="max-w-[220px] truncate px-4 py-3 text-gray-200"
                                                            title={String(row[col] ?? "")}
                                                        >
                                                            {row[col] != null ? String(row[col]) : "—"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
