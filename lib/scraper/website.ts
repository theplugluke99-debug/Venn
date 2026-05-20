import { chromium } from "playwright";
import type { WebsiteAudit } from "@/types";

export async function scrapeWebsite(url: string): Promise<WebsiteAudit> {
  const normalised = url.startsWith("http") ? url : `https://${url}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (compatible; VennBot/1.0; +https://venn.so/bot)",
  });

  const audit: WebsiteAudit = {
    hasSSL: normalised.startsWith("https"),
    hasMobileOptimisation: false,
    hasBookingLink: false,
    hasContactForm: false,
    loadSpeed: null,
    brokenElements: [],
    qualityScore: 0,
  };

  try {
    const page = await context.newPage();

    const startTime = Date.now();
    const response = await page.goto(normalised, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    const loadTime = Date.now() - startTime;

    audit.loadSpeed =
      loadTime < 2000 ? "fast" : loadTime < 5000 ? "moderate" : "slow";

    if (!response || response.status() >= 400) {
      audit.brokenElements.push("page-load-error");
    }

    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.getAttribute("content") ?? "";
    });
    audit.hasMobileOptimisation =
      viewport.includes("width=device-width");

    const bookingKeywords = [
      "book",
      "booking",
      "reserve",
      "appointment",
      "calendly",
      "acuity",
      "schedule",
    ];
    const pageText = await page.evaluate(() =>
      document.body?.innerText?.toLowerCase() ?? ""
    );
    audit.hasBookingLink = bookingKeywords.some((k) => pageText.includes(k));

    const forms = await page.$$eval("form", (el) => el.length);
    const inputs = await page.$$eval('input[type="email"], input[type="tel"]', (el) => el.length);
    audit.hasContactForm = forms > 0 || inputs > 0;

    const brokenImages = await page.$$eval("img", (imgs) =>
      imgs
        .filter((img) => img instanceof HTMLImageElement && !img.naturalWidth && img.complete)
        .map((img) => (img as HTMLImageElement).src)
        .slice(0, 5)
    );
    if (brokenImages.length) {
      audit.brokenElements.push(...brokenImages.map(() => "broken-image"));
    }

    let score = 40;
    if (audit.hasSSL) score += 15;
    if (audit.hasMobileOptimisation) score += 15;
    if (audit.hasBookingLink) score += 10;
    if (audit.hasContactForm) score += 10;
    if (audit.loadSpeed === "fast") score += 10;
    else if (audit.loadSpeed === "moderate") score += 5;
    score -= brokenImages.length * 5;
    audit.qualityScore = Math.max(0, Math.min(100, score));

    await page.close();
  } catch {
    audit.brokenElements.push("scrape-failed");
  } finally {
    await browser.close();
  }

  return audit;
}
