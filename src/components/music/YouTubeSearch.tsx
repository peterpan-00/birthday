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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-2xl mx-auto"}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9BF8A] pointer-events-none" />
          <input
            ref={inputRef}
            id="youtube-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search any song or artist…"
            autoComplete="off"
            spellCheck={false}
            className={`w-full pl-10 pr-10 ${
              compact ? "py-2 text-sm" : "py-3.5 text-base"
            } rounded-2xl bg-[#271E29] border border-[#F5E9DE]/20 !text-[#F5E9DE] text-[#F5E9DE] caret-[#D99CA5] placeholder:text-[#F5E9DE]/45 focus:outline-none focus:ring-2 focus:ring-[#D99CA5]/50 focus:border-[#D99CA5] transition-all duration-200 shadow-inner backdrop-blur-md`}
            style={{
              color: "#F5E9DE",
              WebkitTextFillColor: "#F5E9DE",
            }}
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#F5E9DE]/50 hover:text-[#F5E9DE] hover:bg-[#F5E9DE]/10 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          id="youtube-search-submit"
          className={`flex items-center gap-2 ${
            compact ? "px-4 py-2 text-sm" : "px-6 py-3.5 text-sm sm:text-base font-semibold"
          } rounded-2xl bg-gradient-to-r from-[#D99CA5] to-[#E5B1A3] text-[#19141B] font-medium tracking-wide hover:opacity-95 hover:shadow-[0_0_20px_rgba(217,156,165,0.35)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#19141B]" />
          ) : (
            <Search className="w-4 h-4 text-[#19141B]" />
          )}
          {!compact && <span>Search</span>}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#271E29] border border-[#F5E9DE]/15 text-[#F5E9DE]/70 hover:text-[#F5E9DE] hover:border-[#D99CA5]/40 transition"
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
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#271E29]/60 border border-[#F5E9DE]/10 animate-pulse"
            >
              <div className="w-16 h-12 rounded-xl bg-[#382A3B] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#382A3B] rounded w-3/4" />
                <div className="h-2 bg-[#382A3B]/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#D99CA5]/15 border border-[#D99CA5]/30 text-[#F5E9DE]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#D99CA5]" />
          <div className="flex-1 text-left">
            <p className={compact ? "text-xs" : "text-sm text-[#F5E9DE]"}>{error}</p>
            <p className="text-[11px] text-[#D4C3B7] mt-1">Try another title, song name, or artist.</p>
          </div>
        </div>
      )}

      {/* Empty / Initial hint */}
      {!isLoading && !error && !hasSearched && (
        <div className="flex flex-col items-center gap-2 py-8 text-[#D4C3B7]/60">
          <Music2 className={compact ? "w-6 h-6" : "w-8 h-8 text-[#D9BF8A]/70"} />
          <p className={compact ? "text-xs" : "text-sm text-[#D4C3B7]"}>
            Search for any song or artist to accompany your journey
          </p>
        </div>
      )}

      {/* Results List */}
      {!isLoading && !error && results.length > 0 && (
        <div
          className={`space-y-2.5 ${
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
                onClick={() => handleSelect(result)}
                className={`group flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#D99CA5]/25 via-[#271E29] to-[#D9BF8A]/15 border-[#D99CA5] shadow-[0_0_25px_rgba(217,156,165,0.25)] ring-1 ring-[#D99CA5]/50"
                    : "bg-[#271E29]/70 border-[#F5E9DE]/10 hover:bg-[#271E29] hover:border-[#D99CA5]/40"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-[#19141B] shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#D99CA5]/30 backdrop-blur-[1px] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 text-left">
                  <p
                    className={`font-serif font-semibold truncate leading-tight mb-1 ${
                      compact ? "text-xs" : "text-sm"
                    } ${isSelected ? "text-[#F5E9DE]" : "text-[#F5E9DE]/90 group-hover:text-[#F5E9DE]"}`}
                    title={result.title}
                  >
                    {result.title}
                  </p>
                  <p
                    className={`truncate font-sans ${
                      compact ? "text-[10px]" : "text-xs"
                    } text-[#D4C3B7]/75`}
                  >
                    {result.channelTitle}
                  </p>
                </div>

                {/* Equalizer indicator when selected */}
                {isSelected && (
                  <div className="hidden sm:flex items-end gap-1 h-4 px-2" aria-label="Selected track">
                    <span className="w-1 bg-[#D99CA5] h-3.5 rounded-full animate-pulse" />
                    <span className="w-1 bg-[#D9BF8A] h-2.5 rounded-full animate-pulse delay-75" />
                    <span className="w-1 bg-[#E5B1A3] h-4 rounded-full animate-pulse delay-150" />
                  </div>
                )}

                {/* Select Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(result);
                  }}
                  id={`select-track-${result.id}`}
                  className={`shrink-0 font-medium rounded-xl transition-all active:scale-95 ${
                    compact ? "text-[11px] px-2.5 py-1.5" : "text-xs px-3.5 py-2"
                  } ${
                    isSelected
                      ? "bg-gradient-to-r from-[#D99CA5] to-[#E5B1A3] text-[#19141B] font-semibold shadow-sm"
                      : "bg-[#382A3B]/80 border border-[#F5E9DE]/15 text-[#F5E9DE] hover:bg-[#D99CA5] hover:text-[#19141B] hover:border-[#D99CA5]"
                  }`}
                >
                  {isSelected ? "Selected ✦" : "Select"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
