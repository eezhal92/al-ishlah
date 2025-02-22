import AudioSubs from "@/components/AudioSubs";
import { getMediaEntry } from "./util";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

interface VidsProps {
  params: Promise<{ slug: string}>
  searchParams: Promise<{ t: string }>
}

function isNumber(timems: string) {
  const parsed = parseInt(timems, 10)
  return !isNaN(parsed)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await createClient();

  const media = await getMediaEntry(client, slug)

  if (!media) return { title: 'Not Found' }

  return {
    title: media.title + ' - ' + media.speakerName,
    description: 'Audio ta\'lim - Daar Al-Ishlah',
  };
}

export default async function Vids ({ params, searchParams }: VidsProps) {
  const { slug } = await params
  const { t } = await searchParams

  const startTime = isNumber(t) ? Number(t) : undefined

  const client = await createClient()
  const media = await getMediaEntry(client, slug)

  if (!media) return <div>404</div>

  return (
    <AudioSubs media={media} start={startTime} />
  )
}
