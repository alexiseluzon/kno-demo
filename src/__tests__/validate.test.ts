import { validateSessionInput } from "../../convex/lib/validate";

describe("validateSessionInput", () => {
  const valid = { title: "Intro to React", description: "Learn hooks and state.", category: "Programming" };

  it("accepts valid input and trims", () => {
    const r = validateSessionInput({ ...valid, title: "  Intro to React  " });
    expect(r.ok).toBe(true);
    expect(r.value.title).toBe("Intro to React");
  });

  it("rejects short title", () => {
    expect(validateSessionInput({ ...valid, title: "ab" }).ok).toBe(false);
  });

  it("rejects long description", () => {
    expect(validateSessionInput({ ...valid, description: "x".repeat(501) }).ok).toBe(false);
  });

  it("rejects unknown category", () => {
    expect(validateSessionInput({ ...valid, category: "Hacking" }).ok).toBe(false);
  });
});