import AudioSubs from "@/components/AudioSubs";
import { getMediaEntry } from "./util";
import { createClient } from "@/utils/supabase/server";


export default async function Vids ({ params }: { params: Promise<{ slug: string}> }) {
  const { slug } = await params
  const client = await createClient()
  const media = await getMediaEntry(client, slug)

  if (!media) return <div>404</div>

  return (
    <AudioSubs media={media} />
  )
}
