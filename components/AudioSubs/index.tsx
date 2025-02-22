"use client";

import { ReactEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioSubsProps } from "./AudioSubs.types";
import { getSubtitleBinarySearch } from "./util";

type CaptionOption = "off" | "bahasa" | "arabic"

export default function AudioSubs({ media, start }: AudioSubsProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [text, setText] = useState("");
  const [caption, setCaption] = useState<CaptionOption>("bahasa")
  const captions = useMemo(() => {
    if (caption === 'off') return []
    if (caption === 'bahasa') return media.captions

    if (media.captionsAr) return media.captionsAr

    return [
      { startTime: 10000, endTime: Infinity, text: 'Tidak ada caption arab' }
    ]
  }, [caption, media.captions, media.captionsAr])

  const updateSubtitle: ReactEventHandler<HTMLAudioElement> = useCallback(
    (event) => {
      const el = event.target as unknown as HTMLAudioElement;
      const currentTime = el.currentTime * 1000;
      const text = getSubtitleBinarySearch(currentTime, captions);
      setText(text ?? "");
    },
    [captions]
  );

  useEffect(() => {
    if (audioRef.current && start) {
      console.log(start)
      audioRef.current.currentTime = start;
    }
  }, [start]);

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-2xl">
        <h1 className="font-bold text-2xl md:text-4xl text-center mt-12 mb-4">
          {media.title}
        </h1>
        <p className="text-center italic text-lg md:text-2xl mb-6 md:mb-10">
          {media.speakerName} حفظه الله
        </p>
        <div className="text-center">
          <audio
            ref={audioRef}
            className="w-full max-w-2xl"
            onTimeUpdate={updateSubtitle}
            controls
          >
            <source src={media.audioURL} />
          </audio>
        </div>

        <div className="flex items-center mt-4">
          <label className="font-bold">Caption</label>
          <select onChange={e => setCaption(e.target.value as CaptionOption)} defaultValue="bahasa" className="ml-2 border rounded px-4 py-2">
            <option value="off">Mati</option>
            <option value="bahasa">Indonesia</option>
          </select>
        </div>

        <div className="flex items-center justify-center text-center h-40 md:h-60">
          <p className="text-xl md:text-3xl">{text}</p>
        </div>
      </div>
    </div>
  );
}
