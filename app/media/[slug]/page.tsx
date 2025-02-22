import AudioSubs from "@/components/AudioSubs";
import { getMediaEntry } from "./util";
import { createClient } from "@/utils/supabase/server";

interface VidsProps {
  params: Promise<{ slug: string}>
  searchParams: Promise<{ startms: string }>
}

function isNumber(timems: string) {
  const parsed = parseInt(timems, 10)
  return !isNaN(parsed)
}

export default async function Vids ({ params, searchParams }: VidsProps) {
  const { slug } = await params
  const { startms } = await searchParams

  const startTime = isNumber(startms) ? Number(startms) / 1000: undefined

  const client = await createClient()
  const media = await getMediaEntry(client, slug)

  if (!media) return <div>404</div>

  return (
    <AudioSubs media={media} start={startTime} />
  )
}
