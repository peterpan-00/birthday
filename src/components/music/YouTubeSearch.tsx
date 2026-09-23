"use client";

import React, { useState, useRef, useCallback } from "react";
import { SelectedTrack } from "@/config/songs";
import { Search, Music2, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";

interface YouTubeSearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

interface YouTubeSearchProps {
  onSelect: (track: SelectedTrack) => void;
  onClose?: () => void;
  compact?: boolean; // true = used inside the floating controller panel
}

export function YouTubeSearch({ onSelect, onClose, compact = false }: YouTubeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Search failed. Please try again.");
        return;
      }

      if (!data.results || data.results.length === 0) {
        setError("No results found. Try a different search.");
        return;
      }

      setResults(data.results);
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSelect = (result: YouTubeSearchResult) => {
    setSelectedId(result.id);
    const track: SelectedTrack = {
      videoId: result.id,
      title: result.title,
      artist: result.channelTitle,
      thumbnail: result.thumbnail,
    };
    onSelect(track);
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-2xl mx-auto"}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mau-lavender-soft pointer-events-none" />
          <input
            ref={inputRef}
            id="youtube-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a song or artist…"
            autoComplete="off"
            className={`w-full pl-9 pr-3 ${
              compact ? "py-2 text-sm" : "py-3 text-base"
            } rounded-xl bg-mau-surface/80 border border-mau-border/70 text-mau-cream placeholder:text-mau-lavender-soft/70 focus:outline-none focus:border-mau-rose/60 focus:bg-mau-surface/95 transition-all backdrop-blur-sm`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          id="youtube-search-submit"
          className={`flex items-center gap-2 ${
            compact ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
          } rounded-xl bg-mau-rose text-mau-dark font-semibold hover:bg-mau-blush transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {!compact && <span>Search</span>}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-mau-surface/60 border border-mau-border/50 text-mau-cream/60 hover:text-mau-cream transition"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className={`space-y-3 ${compact ? "max-h-56 overflow-y-auto" : ""}`}>
          {[...Array(compact ? 3 : 5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-mau-surface/40 border border-mau-border/30 animate-pulse"
            >
              <div className="w-16 h-12 rounded-lg bg-mau-surface/80 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-mau-surface/80 rounded w-3/4" />
                <div className="h-2 bg-mau-surface/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-mau-rose/10 border border-mau-rose/30 text-mau-rose">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className={compact ? "text-xs" : "text-sm"}>{error}</p>
        </div>
      )}

      {/* Empty / No Results hint */}
      {!isLoading && !error && !hasSearched && (
        <div className="flex flex-col items-center gap-2 py-6 text-mau-lavender/40">
          <Music2 className={compact ? "w-6 h-6" : "w-8 h-8"} />
          <p className={compact ? "text-xs" : "text-sm"}>
            Search for any song or artist above
          </p>
        </div>
      )}

      {/* Results List */}
      {!isLoading && !error && results.length > 0 && (
        <div
          className={`space-y-2 ${
            compact
              ? "max-h-64 overflow-y-auto pr-1"
              : "max-h-[420px] overflow-y-auto pr-1"
          }`}
          role="listbox"
          aria-label="Search results"
        >
          {results.map((result) => {
            const isSelected = selectedId === result.id;
            return (
              <div
                key={result.id}
                role="option"
                aria-selected={isSelected}
                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-mau-rose/15 border-mau-rose/50 shadow-md"
                    : "bg-mau-surface/40 border-mau-border/30 hover:bg-mau-surface/70 hover:border-mau-border"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-mau-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-mau-rose/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold truncate leading-tight mb-0.5 ${
                      compact ? "text-xs" : "text-sm"
                    } ${isSelected ? "text-mau-rose" : "text-mau-cream"}`}
                    title={result.title}
                  >
                    {result.title}
                  </p>
                  <p
                    className={`truncate ${
                      compact ? "text-[10px]" : "text-xs"
                    } text-mau-lavender/60`}
                  >
                    {result.channelTitle}
                  </p>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelect(result)}
                  id={`select-track-${result.id}`}
                  className={`shrink-0 font-semibold rounded-lg transition-all active:scale-95 ${
                    compact ? "text-[10px] px-2.5 py-1.5" : "text-xs px-3 py-2"
                  } ${
                    isSelected
                      ? "bg-mau-rose text-mau-dark"
                      : "bg-mau-surface border border-mau-border text-mau-cream hover:bg-mau-rose hover:text-mau-dark hover:border-mau-rose"
                  }`}
                >
                  {isSelected ? "✓ Selected" : "Select"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
