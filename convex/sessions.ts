import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateSessionInput } from "./lib/validate";

const RATE_LIMIT = { max: 5, windowMs: 60_000 };

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const identity = await ctx.auth.getUserIdentity();
    const base = category
      ? ctx.db
          .query("sessions")
          .withIndex("by_category", (q) => q.eq("category", category))
      : ctx.db.query("sessions");
    const docs = await base.order("desc").take(50);
    return docs.map(({ hostId, ...d }) => ({
      ...d,
      isOwner: identity?.tokenIdentifier === hostId,
    }));
  },
});

export const create = mutation({
  args: { title: v.string(), description: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Please sign in.");

    const result = validateSessionInput(args);
    if (!result.ok) throw new ConvexError(result.errors.join(" "));

    // Rate limit: max 5 sessions per minute per user
    const recent = await ctx.db
      .query("sessions")
      .withIndex("by_host", (q) =>
        q
          .eq("hostId", identity.tokenIdentifier)
          .gt("_creationTime", Date.now() - RATE_LIMIT.windowMs)
      )
      .take(RATE_LIMIT.max);
    if (recent.length >= RATE_LIMIT.max) {
      throw new ConvexError("Too many sessions. Try again in a minute.");
    }

    return await ctx.db.insert("sessions", {
      ...result.value,
      hostId: identity.tokenIdentifier,
      hostName: (identity.name ?? identity.email ?? "Anonymous").slice(0, 60),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Please sign in.");

    const doc = await ctx.db.get(id);
    if (!doc) throw new ConvexError("Session not found.");
    if (doc.hostId !== identity.tokenIdentifier) {
      throw new ConvexError("You can only delete your own sessions.");
    }
    await ctx.db.delete(id);
  },
});