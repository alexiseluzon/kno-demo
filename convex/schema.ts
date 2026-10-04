import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    hostId: v.string(), // identity.tokenIdentifier
    hostName: v.string(),
  })
    .index("by_host", ["hostId"])
    .index("by_category", ["category"]),
});