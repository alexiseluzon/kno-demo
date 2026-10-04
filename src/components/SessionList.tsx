"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CATEGORIES } from "../../convex/lib/validate";
import { errorMessage } from "@/lib/errors";
import ConfirmDialog from "./ConfirmDialog";

export default function SessionList() {
  const [category, setCategory] = useState("");
  const sessions = useQuery(api.sessions.list, category ? { category } : {});
  const remove = useMutation(api.sessions.remove);
  const [target, setTarget] = useState<Id<"sessions"> | null>(null);
  const [busy, setBusy] = useState(false);

  async function doDelete() {
    if (!target) return;
    setBusy(true);
    try {
      await remove({ id: target });
      toast.success("Session deleted.");
      setTarget(null);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="list-h" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="list-h" className="text-lg font-semibold">Sessions</h2>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only sm:not-sr-only">Filter</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {sessions === undefined && (
        <p className="text-sm text-slate-500" role="status">Loading...</p>
      )}
      {sessions?.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">
          No sessions yet.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {sessions?.map((s) => (
          <li key={s._id} className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm">
            <div>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {s.category}
              </span>
              <h3 className="mt-2 font-semibold break-words">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600 break-words">{s.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>by {s.hostName}</span>
              {s.isOwner && (
                <button
                  onClick={() => setTarget(s._id)}
                  title="Delete session"
                  aria-label={`Delete ${s.title}`}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  </svg>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!target}
        title="Delete this session?"
        message="This cannot be undone."
        confirmLabel="Delete"
        loading={busy}
        onConfirm={doDelete}
        onCancel={() => setTarget(null)}
      />
    </section>
  );
}