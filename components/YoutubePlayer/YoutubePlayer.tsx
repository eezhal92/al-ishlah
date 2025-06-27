"use client";

import { Caption, ContentMedia } from '@/types/short';
import Plyr from 'plyr'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getSubtitleBinarySearch } from '../AudioSubs/util';

interface Props {
  videoID: string
  media: ContentMedia
  mode?: 'tashililmi' | 'ypist';
  defaultShowVideo?: boolean;
}

function YoutubePlayer(props: Props) {
  const { videoID, media, mode: logo, defaultShowVideo = false } = props;
  const plyr =  useRef<Plyr>(null)
  const [isPlaying, setPlaying] = useState(true)

  const [isShowVideo, setShowVideo] = useState<boolean>(defaultShowVideo);
  const className = useMemo(() => {
    let clx = ''
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
      controls: ['play', 'progress', 'current-time', ],
    };
    const player = new Plyr('#player', options);
    player.on('canplay', () => {
      player.play()
    })
    plyr.current = player
    player.on('ready', () => {
      player.play()
    })
    player.on('timeupdate', () => {
      const currentTime = player.currentTime;
      updateSubtitle(currentTime, captions)
    });
    player.on('play', () => {
      setPlaying(true)
    })
    player.on('pause', () => {
      setPlaying(false)
    })
  }, [media, updateSubtitle]);

  return (
    <div id="youtube-player" className={`youtube-short flex justify-center px-4 md:px-0 relative ` + className}>
      <div className="w-full max-w-2xl">

        <div onClick={() => plyr.current?.togglePlay()} className='absolute z-10 top-0 right-0 left-0 bottom-0 flex items-center justify-center'>
          <div className="text-center text-white m-container h-40 md:h-60">
            <p className="px-4 text-2xl md:text-3xl font-bold">{text}</p>
          </div>
        </div>

        {logo !== 'ypist' && <div className="absolute z-10 right-2 top-2">
          <button className="p-2 rounded mt-2 transition bg-slate-300 hover:bg-slate-100" onClick={() => setShowVideo(!isShowVideo)}>{isShowVideo ? 'Sembunyi Video' : 'Tampilkan Video'}</button>
        </div>}

        <div className="absolute z-10 left-2 top-2 gap-4 flex items-center">
          {logo === 'ypist' && (
          <a target="_blank" className='flex items-center gap-4' href="https://peduliilmu.org">
            <span className="flex justify-center">
              <img
                src="/images/ypist-white.png"
                alt="YPist Logo"
                className="h-12 w-auto"
              />
            </span>
            <span className="text-white">Peduli Ilmu Sulawesi Tengah</span>
          </a>
          )}
          <button onClick={() => {
            plyr.current?.togglePlay()
          }} className="p-2 rounde invisible md:visible mt-2 transition bg-slate-300 hover:bg-slate-100">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>

        <div className="absolute z-20 right-0 left-0 bottom-0">
          <div className="m-container mx-auto">


          <div style={{ color: '#fff' }} className="px-4 pt-2 pb-1">
            <h1 className="font-bold text-xl md:text-4xl mb-1">
              {media.title}
            </h1>
            <p className="text-md italic md:text-2xl mb-1">
              {media.speakerName} حفظه الله
            </p>
            {media.credit && <p className="text-sm">Credit: {media.credit}</p>}
          </div>
          <div id="player" data-plyr-provider="youtube" data-plyr-embed-id={videoID}  />
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubePlayer;
