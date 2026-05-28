export interface CompaniesHouseResult {
  companiesHouseNumber: string | null;
  companyStatus: string | null;
  employeeBand: string | null;
  sicCode: string | null;
  incorporationDate: Date | null;
  directorName: string | null;
}

function authHeader(apiKey: string) {
  return { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}` };
}

function levenshtein(a: string, b: string): number {
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] =
        b[i - 1] === a[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }
  return m[b.length][a.length];
}

function similarity(a: string, b: string): number {
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length >= b.length ? b : a;
  if (longer.length === 0) return 1;
  return (longer.length - levenshtein(longer, shorter)) / longer.length;
}

function findBestMatch(companies: Record<string, unknown>[], businessName: string, location: string) {
  const scored = companies.map((c) => {
    let score = 0;
    const title = String(c.title ?? "").toLowerCase();
    score += similarity(title, businessName.toLowerCase()) * 50;
    const locality = String((c as Record<string, Record<string, string>>).address?.locality ?? "").toLowerCase();
    const city = location.toLowerCase().split(",")[0].trim();
    if (locality.includes(city) || city.includes(locality)) score += 30;
    if (c.company_status === "active") score += 20;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 40 ? scored[0].c : null;
}

export async function lookupCompaniesHouse(lead: {
  businessName: string;
  location: string;
}): Promise<CompaniesHouseResult | null> {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  if (!apiKey) return null;

  try {
    const BASE = "https://api.company-information.service.gov.uk";
    const headers = authHeader(apiKey);

    const searchRes = await fetch(
      `${BASE}/search/companies?q=${encodeURIComponent(lead.businessName)}&items_per_page=5`,
      { headers, signal: AbortSignal.timeout(10000) }
    );
    if (!searchRes.ok) return null;
    const searchData = (await searchRes.json()) as { items?: Record<string, unknown>[] };
    if (!searchData.items?.length) return null;

    const company = findBestMatch(searchData.items, lead.businessName, lead.location);
    if (!company) return null;

    const num = String(company.company_number ?? "");

    const [detailRes, officersRes] = await Promise.all([
      fetch(`${BASE}/company/${num}`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`${BASE}/company/${num}/officers`, { headers, signal: AbortSignal.timeout(8000) }),
    ]);

    const detail = detailRes.ok ? ((await detailRes.json()) as Record<string, unknown>) : {};
    const officers = officersRes.ok
      ? ((await officersRes.json()) as { items?: Record<string, unknown>[] })
      : { items: [] };

    const activeDirector = officers.items?.find(
      (o) => o.officer_role === "director" && !o.resigned_on
    );

    return {
      companiesHouseNumber: num,
      companyStatus: String(detail.company_status ?? "") || null,
      employeeBand: null,
      sicCode:
        (Array.isArray(detail.sic_codes) ? (detail.sic_codes as string[])[0] : null) ?? null,
      incorporationDate: detail.date_of_creation
        ? new Date(String(detail.date_of_creation))
        : null,
      directorName: activeDirector ? String(activeDirector.name ?? "") || null : null,
    };
  } catch {
    return null;
  }
}
