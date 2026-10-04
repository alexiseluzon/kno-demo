/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";

const modules = import.meta.glob("../../convex/**/*.*s");

const alice = { tokenIdentifier: "clerk|alice", name: "Alice" };
const bob = { tokenIdentifier: "clerk|bob", name: "Bob" };
const input = {
  title: "Intro to React",
  description: "Learn hooks and state.",
  category: "Programming",
};

describe("sessions", () => {
  it("rejects unauthenticated create", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.sessions.create, input)).rejects.toThrow("Please sign in.");
  });

  it("creates, flags ownership, and hides hostId", async () => {
    const t = convexTest(schema, modules);
    await t.withIdentity(alice).mutation(api.sessions.create, input);
    const asAlice = await t.withIdentity(alice).query(api.sessions.list, {});
    const asBob = await t.withIdentity(bob).query(api.sessions.list, {});
    expect(asAlice[0].isOwner).toBe(true);
    expect(asBob[0].isOwner).toBe(false);
    expect(asAlice[0]).not.toHaveProperty("hostId");
  });

  it("rejects invalid input", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.withIdentity(alice).mutation(api.sessions.create, { ...input, category: "Hacking" })
    ).rejects.toThrow("Invalid category");
  });

  it("rate limits to 5 per minute", async () => {
    const t = convexTest(schema, modules);
    const as = t.withIdentity(alice);
    for (let i = 0; i < 5; i++) await as.mutation(api.sessions.create, input);
    await expect(as.mutation(api.sessions.create, input)).rejects.toThrow("Too many sessions");
  });

  it("only the owner can delete", async () => {
    const t = convexTest(schema, modules);
    const id = await t.withIdentity(alice).mutation(api.sessions.create, input);
    await expect(
      t.withIdentity(bob).mutation(api.sessions.remove, { id })
    ).rejects.toThrow("only delete your own");
    await t.withIdentity(alice).mutation(api.sessions.remove, { id });
    expect(await t.query(api.sessions.list, {})).toHaveLength(0);
  });
});