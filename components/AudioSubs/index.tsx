"use client";

import { ReactEventHandler, useCallback, useState } from "react";
import { AudioSubsProps } from "./AudioSubs.types";
import { getSubtitleBinarySearch } from "./util";

export default function AudioSubs({ media }: AudioSubsProps) {
  const [text, setText] = useState("");

  const updateSubtitle: ReactEventHandler<HTMLAudioElement> = useCallback(
    (event) => {
      const el = event.target as unknown as HTMLAudioElement;
      const currentTime = el.currentTime * 1000;
      const text = getSubtitleBinarySearch(currentTime, media.captions);
      setText(text ?? "");
    },
    [media.captions]
  );

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-2xl">
        <h1 className="font-bold text-2xl md:text-4xl text-center mt-12 mb-4">
          {media.title}
        </h1>
        <p className="text-center italic text-lg md:text-2xl mb-6 md:mb-10">
          {media.speakerName} حفظه الله
        </p>
        <div className="flex items-center justify-center text-center h-40 md:h-60">
          <p className="text-xl md:text-3xl">{text}</p>
        </div>
        <div className="text-center">
          <audio
            className="w-full max-w-2xl"
            onTimeUpdate={updateSubtitle}
            controls
          >
            <source src={media.audioURL} />
            <track kind="subtitles" src="/test.vtt" srcLang="id" label="Indonesia" />
          </audio>
        </div>
      </div>
    </div>
  );
}
