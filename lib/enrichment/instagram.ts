import { chromium } from "playwright";

export interface InstagramResult {
  instagramHandle: string | null;
  instagramFollowers: number | null;
  instagramPostCount: number | null;
  instagramLastPost: Date | null;
  instagramEngagement: number | null;
  instagramBio: string | null;
}

async function findHandleOnWebsite(website: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(website.startsWith("http") ? website : `https://${website}`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    const links = await page.$$eval('a[href*="instagram.com"]', (els) =>
      (els as HTMLAnchorElement[]).map((l) => l.href)
    );
    for (const link of links) {
      const match = link.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
      const handle = match?.[1];
      if (handle && !["p", "reel", "explore", "accounts", "stories"].includes(handle)) {
        return handle;
      }
    }
    return null;
  } finally {
    await browser.close();
  }
}

async function findHandleViaGoogle(businessName: string, location: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const query = encodeURIComponent(`"${businessName}" "${location}" site:instagram.com`);
    await page.goto(`https://www.google.com/search?q=${query}`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    const urls = await page.$$eval("a[href*='instagram.com']", (els) =>
      (els as HTMLAnchorElement[]).map((l) => l.href)
    );
    for (const url of urls) {
      if (!url.includes("/p/") && !url.includes("/reel/")) {
        const match = url.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
        const handle = match?.[1];
        if (handle && !["p", "reel", "explore", "accounts", "stories"].includes(handle)) {
          return handle;
        }
      }
    }
    return null;
  } finally {
    await browser.close();
  }
}

export async function scrapeInstagram(lead: {
  instagramHandle?: string | null;
  businessName: string;
  location: string;
  website?: string | null;
}): Promise<InstagramResult | null> {
  let handle = lead.instagramHandle ?? null;

  if (!handle && lead.website) {
    handle = await findHandleOnWebsite(lead.website).catch(() => null);
  }
  if (!handle) {
    handle = await findHandleViaGoogle(lead.businessName, lead.location).catch(() => null);
  }
  if (!handle) return null;

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });
    await page.goto(`https://www.instagram.com/${handle}/`, {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    const metaData = await page.evaluate(() => {
      const getMeta = (name: string) =>
        document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ??
        document.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ??
        null;
      const jsonLd = document.querySelector('script[type="application/ld+json"]');
      if (jsonLd) {
        try {
          return JSON.parse(jsonLd.textContent ?? "");
        } catch {
          // ignore
        }
      }
      return { description: getMeta("og:description"), title: getMeta("og:title") };
    });

    let followers: number | null = null;
    let posts: number | null = null;
    let bio: string | null = null;

    if (metaData?.description) {
      const fMatch = (metaData.description as string).match(/([0-9,.]+)\s+Followers/i);
      if (fMatch) followers = parseInt(fMatch[1].replace(/[,.]/g, ""), 10);
      const pMatch = (metaData.description as string).match(/([0-9,.]+)\s+Posts/i);
      if (pMatch) posts = parseInt(pMatch[1].replace(/[,.]/g, ""), 10);
    }
    if (metaData?.title) {
      bio = (metaData.title as string).replace(/@[a-zA-Z0-9_.]+/, "").trim() || null;
    }

    const timestamps = await page
      .$$eval("time[datetime]", (els) => (els as HTMLTimeElement[]).map((t) => t.getAttribute("datetime")))
      .catch(() => [] as (string | null)[]);
    const lastPost = timestamps[0] ? new Date(timestamps[0]) : null;

    return {
      instagramHandle: handle,
      instagramFollowers: followers,
      instagramPostCount: posts,
      instagramLastPost: lastPost,
      instagramEngagement: null,
      instagramBio: bio,
    };
  } finally {
    await browser.close();
  }
}
