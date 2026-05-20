import type { InstagramData } from "@/types";

export async function scrapeInstagram(handle: string): Promise<InstagramData | null> {
  const cleanHandle = handle.replace("@", "").trim();

  try {
    const response = await fetch(
      `https://www.instagram.com/${cleanHandle}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) return buildMinimalInstagramData(cleanHandle);

    const data = await response.json().catch(() => null);
    if (!data?.graphql?.user) return buildMinimalInstagramData(cleanHandle);

    const user = data.graphql.user;
    const posts = user.edge_owner_to_timeline_media?.edges ?? [];
    const totalLikes = posts.reduce(
      (sum: number, p: { node: { edge_liked_by: { count: number }; edge_media_to_comment: { count: number } } }) =>
        sum + (p.node.edge_liked_by?.count ?? 0) + (p.node.edge_media_to_comment?.count ?? 0),
      0
    );
    const followerCount: number = user.edge_followed_by?.count ?? 0;
    const engagementRate =
      followerCount > 0 && posts.length > 0
        ? (totalLikes / posts.length / followerCount) * 100
        : null;

    const lastPostTimestamp =
      posts[0]?.node?.taken_at_timestamp ?? null;
    const lastPostDate = lastPostTimestamp
      ? new Date(lastPostTimestamp * 1000).toISOString()
      : null;

    const daysSinceLastPost = lastPostDate
      ? (Date.now() - new Date(lastPostDate).getTime()) / 86400000
      : null;
    let postFrequency: string | null = null;
    if (daysSinceLastPost !== null) {
      if (daysSinceLastPost < 3) postFrequency = "daily";
      else if (daysSinceLastPost < 10) postFrequency = "weekly";
      else if (daysSinceLastPost < 35) postFrequency = "monthly";
      else postFrequency = "inactive";
    }

    return {
      handle: cleanHandle,
      followerCount,
      engagementRate: engagementRate ? parseFloat(engagementRate.toFixed(2)) : null,
      postFrequency,
      lastPostDate,
      repliesComments: posts.some(
        (p: { node: { edge_media_to_comment: { count: number } } }) => (p.node.edge_media_to_comment?.count ?? 0) > 0
      ),
    };
  } catch {
    return buildMinimalInstagramData(cleanHandle);
  }
}

function buildMinimalInstagramData(handle: string): InstagramData {
  return {
    handle,
    followerCount: null,
    engagementRate: null,
    postFrequency: null,
    lastPostDate: null,
    repliesComments: false,
  };
}
