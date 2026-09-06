/**
 * SelectedTrack — the runtime type produced by YouTube Data API v3 search.
 * Used throughout the music system for playback. No manual URL/ID entry required.
 */
export interface SelectedTrack {
  videoId: string;
  title: string;
  artist: string;     // channelTitle from YouTube API
  thumbnail: string;  // default thumbnail URL from YouTube API
}

/**
 * Song — legacy static type kept for backwards compatibility only.
 * The music system now uses SelectedTrack from YouTube search results.
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeVideoId: string;
  duration?: string;
  mood: string;
  thumbnailUrl?: string;
  description?: string;
}

export const songs: Song[] = [
  {
    id: "song-01",
    title: "Until I Found You (Acoustic)",
    artist: "Stephen Sanchez",
    youtubeVideoId: "GxldQ9eX2wo",
    mood: "Dreamy & Warm",
    description: "Soft acoustic strings and vintage romance vibes for an intimate memory journey.",
  },
  {
    id: "song-02",
    title: "Golden Hour (Orchestral / Piano)",
    artist: "JVKE",
    youtubeVideoId: "PEM0Vs8jf1w",
    mood: "Cinematic & Glowing",
    description: "Cascading piano melodies and sweeping harmony that feels like golden sunshine.",
  },
  {
    id: "song-03",
    title: "Photograph",
    artist: "Ed Sheeran",
    youtubeVideoId: "nSDgHBxUbVQ",
    mood: "Nostalgic & Heartfelt",
    description: "A timeless ode to keeping memories frozen in time and holding onto love.",
  },
  {
    id: "song-04",
    title: "Make You Feel My Love",
    artist: "Adele",
    youtubeVideoId: "0put0_a--Ng",
    mood: "Soulful & Gentle",
    description: "Gentle piano ballad that speaks straight to family bonds and unconditional care.",
  },
  {
    id: "song-05",
    title: "Here Comes the Sun (Acoustic Fingerstyle)",
    artist: "The Beatles / Sungha Jung",
    youtubeVideoId: "GYJ2XwO4t8g",
    mood: "Joyful & Uplifting",
    description: "Lighthearted, bright acoustic vibes full of warmth and smiles.",
  },
];
