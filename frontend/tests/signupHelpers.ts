import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export async function registerDemoFamily(page: Page, submit = true) {
  await page.goto("/#/register");
  await page.getByLabel("Parent name").fill("Taylor Parent");
  await page.getByLabel("Parent email").fill("taylor@example.com");
  await page.getByLabel("Demo password", { exact: true }).fill("practice-only");
  await page.getByLabel("Confirm demo password").fill("practice-only");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Student name").fill("Jordan Learner");
  await page.getByLabel("Student email").fill("jordan@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Learning preference").selectOption("Hybrid");
  await page.getByLabel("Preferred time block").selectOption("8–10 AM");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Funding preference").selectOption("ESA");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  if (!submit) return;
  await page
    .getByRole("button", { name: "Complete registration demo" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Set up two-factor authentication" }),
  ).toBeVisible();
}

export async function completeDemoVerification(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Set up two-factor authentication" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("tala.frontend-demo.session"),
    ),
  ).toBeNull();
  await page.getByRole("button", { name: "Continue to verification" }).click();
  await page.getByLabel("Verification code").fill("246810");
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your family demo is ready." }),
  ).toBeVisible();
}
