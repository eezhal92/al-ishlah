"use client";

import { useEffect, useRef, useState } from "react";

export type PlayerEntry = {
  url: string;
  slug: string;
  title: string;
  ustadh: string;
};

export default function Player({
  entries,
  defaultEntrySlug = "",
}: {
  entries: PlayerEntry[];
  defaultEntrySlug?: string;
}) {
  const [entry, setEntry] = useState<PlayerEntry | null>(
    entries.find((e) => e.slug === defaultEntrySlug) ?? null
  );

  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const nextEntry = entries.find((e) => e.slug === defaultEntrySlug) ?? null;
    setEntry(nextEntry);
  }, [ref, entries, defaultEntrySlug]);

  if (!entry) return null;

  return (
    <div className="z-10 fixed bottom-0 left-0 right-0 text-white bg-black shadow-sm border-t py-4">
      <div className="flex flex-col items-center">
        <div>
          <audio autoPlay ref={ref} controls src={entry.url}></audio>
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold">{entry.title}</p>
          <p className="text-sm">{entry.ustadh} حفظه الله</p>
        </div>
      </div>
    </div>
  );
}
