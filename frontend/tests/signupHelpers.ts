import { TOTP, Secret } from "otpauth";
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
  const authenticator = await readAuthenticator(page);
  await page.getByRole("button", { name: "Continue to verification" }).click();
  await page.getByLabel("Verification code").fill(authenticator.generate());
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your family demo is ready." }),
  ).toBeVisible();
}

export async function readAuthenticator(page: Page) {
  const key = page.locator(".two-factor-manual code");
  await expect(key).toHaveText(/^[A-Z2-7]{32}$/);
  return new TOTP({
    secret: Secret.fromBase32((await key.textContent())!),
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });
}
export function invalidCode(authenticator: TOTP) {
  let value = 0;
  while (
    authenticator.validate({
      token: String(value).padStart(6, "0"),
      window: 2,
    }) !== null
  )
    value++;
  return String(value).padStart(6, "0");
}
