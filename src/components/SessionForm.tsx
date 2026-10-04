"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { CATEGORIES, LIMITS, validateSessionInput } from "../../convex/lib/validate";
import { errorMessage } from "@/lib/errors";
import ConfirmDialog from "./ConfirmDialog";

export default function SessionForm() {
  const create = useMutation(api.sessions.create);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const check = validateSessionInput({ title, description, category });
  const disabled = !check.ok || busy;

  async function submit() {
    setBusy(true);
    try {
      await create({ title, description, category });
      toast.success("Session posted.");
      setTitle("");
      setDescription("");
      setConfirm(false);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <>
      <form
        onSubmit={(e) => { e.preventDefault(); if (!disabled) setConfirm(true); }}
        className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
        aria-label="Post a learning session"
      >
        <h2 className="text-lg font-semibold">Post a session</h2>
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">Title</label>
          <input id="title" className={input} value={title} maxLength={LIMITS.title.max}
            onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="desc" className="mb-1 block text-sm font-medium">Description</label>
          <textarea id="desc" rows={3} className={input} value={description}
            maxLength={LIMITS.description.max}
            onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="cat" className="mb-1 block text-sm font-medium">Category</label>
          <select id="cat" className={input} value={category}
            onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={disabled}
          title={disabled ? "Fill in all fields first" : "Post session"}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Post session
        </button>
      </form>

      <ConfirmDialog
        open={confirm}
        title="Post this session?"
        message="It will be visible to everyone."
        confirmLabel="Post"
        loading={busy}
        onConfirm={submit}
        onCancel={() => setConfirm(false)}
      />
    </>
  );
}