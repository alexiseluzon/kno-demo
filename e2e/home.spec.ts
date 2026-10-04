import { test, expect } from "@playwright/test";

test.describe("signed-out visitor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("sees heading, sign-in prompt, and sessions list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /learn something/i })).toBeVisible();
    await expect(page.getByText("Sign in to post a session.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sessions" })).toBeVisible();
    await expect(page.getByRole("form", { name: "Post a learning session" })).toHaveCount(0);
  });

  test("sign-in button opens the Clerk modal", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.locator(".cl-modalContent, .cl-signIn-root").first()).toBeVisible();
  });

  test("skip link is the first focusable element", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("category filter is usable", async ({ page }) => {
    await page.getByRole("combobox").first().selectOption("Programming");
    await expect(page.getByRole("heading", { name: "Sessions" })).toBeVisible();
  });
});