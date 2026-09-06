import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/auth/authorization";

const YT_SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
const MAX_QUERY_LENGTH = 150;
const MAX_RESULTS = 8;

export interface YouTubeSearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

export async function GET(request: NextRequest) {
  const authorization = await checkAuthorization();
  if (!authorization.isAuthenticated) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (!authorization.isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  // --- Input validation ---
  if (!q) {
    return NextResponse.json(
      { error: "Search query is required." },
      { status: 400 }
    );
  }

  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "Search query is too long." },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("[YouTube Search] YOUTUBE_API_KEY is not set");
    return NextResponse.json(
      { error: "Music search is not configured. Please contact the site owner." },
      { status: 503 }
    );
  }

  // --- Call YouTube Data API v3 ---
  const url = new URL(YT_SEARCH_ENDPOINT);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", q);
  url.searchParams.set("maxResults", String(MAX_RESULTS));
  url.searchParams.set("key", apiKey);
  // Prefer music-related results
  url.searchParams.set("videoCategoryId", "10");
  url.searchParams.set("safeSearch", "moderate");

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: { "Accept": "application/json" },
      // Next.js: don't cache the API response, each search is unique
      cache: "no-store",
    });
  } catch (err) {
    console.error("[YouTube Search] Network error:", err);
    return NextResponse.json(
      { error: "Could not reach YouTube. Check your internet connection." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const ytError = errorBody?.error;

    // Quota exceeded
    if (ytError?.errors?.[0]?.reason === "quotaExceeded" || ytError?.code === 403) {
      console.error("[YouTube Search] Quota exceeded or forbidden:", ytError);
      return NextResponse.json(
        { error: "Search quota exceeded for today. Try again tomorrow, or search by video ID." },
        { status: 429 }
      );
    }

    // Bad key
    if (ytError?.code === 400) {
      console.error("[YouTube Search] Bad request / invalid key:", ytError);
      return NextResponse.json(
        { error: "Music search is misconfigured. Please contact the site owner." },
        { status: 503 }
      );
    }

    console.error("[YouTube Search] YouTube API error:", ytError);
    return NextResponse.json(
      { error: "YouTube search failed. Please try again." },
      { status: response.status }
    );
  }

  const data = await response.json();

  // --- Sanitize and return only safe, minimal fields ---
  const results: YouTubeSearchResult[] = (data.items ?? [])
    .filter((item: any) => item?.id?.videoId && item?.snippet)
    .map((item: any): YouTubeSearchResult => ({
      id: item.id.videoId,
      title: item.snippet.title ?? "Unknown Title",
      channelTitle: item.snippet.channelTitle ?? "Unknown Artist",
      thumbnail:
        item.snippet.thumbnails?.medium?.url ??
        item.snippet.thumbnails?.default?.url ??
        `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
    }));

  return NextResponse.json({ results });
}
