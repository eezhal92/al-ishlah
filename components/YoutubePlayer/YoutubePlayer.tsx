"use client";

import { Caption, ContentMedia } from '@/types/short';
import Plyr from 'plyr'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSubtitleBinarySearch } from '../AudioSubs/util';

interface Props {
  videoID: string
  media: ContentMedia
  defaultShowVideo?: boolean;
}

function YoutubePlayer(props: Props) {
  const { videoID, media, defaultShowVideo = false } = props;

  const [isShowVideo, setShowVideo] = useState<boolean>(defaultShowVideo);
  const className = useMemo(() => {
    let clx = 'flex justify-center px-4 md:px-0'
    if (isShowVideo) {
      clx += ' show-video'
    }
    return clx
  }, [isShowVideo])

  const [text, setText] = useState('')

  useEffect(() => {

  }, [])

  const updateSubtitle = useCallback(
    (time: number, captions: Caption[]) => {
      const currentTime = time * 1000;
      const text = getSubtitleBinarySearch(currentTime, captions);
      setText(text ?? "");
    },
    []
  );

  useEffect(() => {
    const { captions } = media
    const options: Plyr.Options = {
      hideControls: false,
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions'],
    };
    const player = new Plyr('#player', options);
    player.on('timeupdate', () => {
      const currentTime = player.currentTime;
      updateSubtitle(currentTime, captions)
    });
  }, [media, updateSubtitle]);

  return (
    <div className={className}>
      <div className="w-full max-w-2xl">
        <h1 className="font-bold text-2xl md:text-4xl text-center mt-12 mb-4">
          {media.title}
        </h1>
        <p className="text-center italic text-lg md:text-2xl mb-6 md:mb-10">
          {media.speakerName} حفظه الله
        </p>
        <div className="text-center">
          <div id="player" data-plyr-provider="youtube" data-plyr-embed-id={videoID}  />

          <button className="p-2 rounded mt-2 transition bg-slate-300 hover:bg-slate-100" onClick={() => setShowVideo(!isShowVideo)}>{isShowVideo ? 'Sembunyi Video' : 'Tampilkan Video'}</button>
        </div>

        <div className="flex items-center mt-4">
          <label className="font-bold">Caption</label>
        </div>

        <div className="flex items-center justify-center text-center h-40 md:h-60">
          <p className="text-xl md:text-3xl">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default YoutubePlayer;
