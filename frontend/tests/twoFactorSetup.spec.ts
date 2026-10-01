import jsQR from "jsqr";
import { URI } from "otpauth";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { registerDemoFamily, readAuthenticator } from "./signupHelpers";

test("2FA setup methods, account information and local authenticator provisioning", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4173"))
      errors.push(request.url());
  });
  await registerDemoFamily(page);
  await expect(page.locator(".two-factor-account")).toContainText(
    "Taylor Parent",
  );
  await expect(page.locator(".two-factor-account")).toContainText(
    "taylor@example.com",
  );
  await expect(
    page.getByRole("radio", { name: /Authenticator app/ }),
  ).toBeChecked();
  await expect(
    page.getByRole("img", { name: /Scan this demo QR/ }),
  ).toBeVisible();
  const authenticator = await readAuthenticator(page);
  const pixels = await page
    .locator(".two-factor-qr-image")
    .evaluate(async (element) => {
      const img = element as HTMLImageElement;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(img, 0, 0);
      return {
        data: Array.from(
          context.getImageData(0, 0, canvas.width, canvas.height).data,
        ),
        width: canvas.width,
        height: canvas.height,
      };
    });
  const decoded = jsQR(
    new Uint8ClampedArray(pixels.data),
    pixels.width,
    pixels.height,
  );
  expect(Boolean(decoded)).toBe(true);
  const scanned = URI.parse(decoded!.data);
  expect(scanned.secret.base32 === authenticator.secret.base32).toBe(true);
  expect(scanned.issuer).toBe("TALA Hub Demo");
  expect(scanned.label).toBe("taylor@example.com");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("authenticator-setup.png"),
    mask: [page.locator(".two-factor-provisioning")],
    fullPage: true,
  });
  await page.getByRole("button", { name: "Continue to verification" }).click();
  await expect(
    page.getByText("Selected method:", { exact: false }),
  ).toContainText("Authenticator app");
  await page.getByRole("button", { name: "Back to setup" }).click();
  expect(
    (await readAuthenticator(page)).secret.base32 ===
      authenticator.secret.base32,
  ).toBe(true);
  await page.getByRole("radio", { name: /Email code/ }).check();
  await expect(
    page.getByRole("img", { name: /Scan this demo QR/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Verify with an email code" }),
  ).toBeVisible();
  await expect(
    page.getByText("No message will be sent.", { exact: false }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("email-setup.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Continue to verification" }).click();
  await expect(
    page.getByText("Selected method:", { exact: false }),
  ).toContainText("Email code");
  await page.getByRole("button", { name: "Back to setup" }).click();
  await expect(page.getByRole("radio", { name: /Email code/ })).toBeChecked();
  await page.getByRole("button", { name: "Continue to verification" }).click();
  await page.getByLabel("Verification code").fill("246810");
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your family demo is ready." }),
  ).toBeVisible();
  const storage = await page.evaluate(() =>
    JSON.stringify({ ...sessionStorage, ...localStorage }),
  );
  expect(storage).not.toMatch(/DEMO-ONLY|246810|challenge/);
  expect(errors).toEqual([]);
});

test("Authenticator accepts a scanned code, rejects expired codes and never stores its secret", async ({
  page,
}) => {
  await registerDemoFamily(page);
  const authenticator = await readAuthenticator(page);
  await page.getByRole("button", { name: "Continue to verification" }).click();
  let expired = authenticator.generate({ timestamp: Date.now() - 300000 });
  // Avoid a chance collision with a currently valid six-digit code.
  for (
    let age = 330000;
    authenticator.validate({ token: expired, window: 2 }) !== null;
    age += 30000
  )
    expired = authenticator.generate({ timestamp: Date.now() - age });
  await page.getByLabel("Verification code").fill(expired);
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("expired");
  await page.getByLabel("Verification code").fill(authenticator.generate());
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your family demo is ready." }),
  ).toBeVisible();
  const storage = await page.evaluate(() =>
    JSON.stringify({ ...sessionStorage, ...localStorage }),
  );
  expect(storage.includes(authenticator.secret.base32)).toBe(false);
  await expect(page.locator(".two-factor-manual code")).toHaveCount(0);
});

// Authentication tests handle ephemeral enrollment secrets; do not record traces.
test.use({ trace: "off", screenshot: "off" });
