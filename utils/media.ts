import { Caption, ContentMedia } from "@/types/short";
import { SupabaseClient } from "@/utils/supabase/server";

export async function getMediaEntry(client: SupabaseClient, slug: string): Promise<ContentMedia | null> {
  const row = await client.from('shorts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!row.data) return null

  return {
    speakerName: row.data.speaker_name,
    youtubeID: getYoutubeID(row.data.audio_url),
    title: row.data.title,
    audioURL: row.data.audio_url,
    captions: parseVTT(row.data.captions_vtt),
    captionsAr: row.data.captions_ar_vtt ? parseVTT(row.data.captions_ar_vtt) : null,
  }
}

// Taken from stackoverflow
export function getYoutubeID(url: string) : string | null {
  if (!url.includes('youtube.com')) return null
  let ID = '';
  const urls = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (urls[2] !== undefined) {
    ID = urls[2].split(/[^0-9a-z_\-]/i)[0];
  } else {
    ID = url;
  }
  return ID;
}


export function parseVTT(vttText: string) {
  const captions: Caption[] = [];
  const lines = vttText.split("\n");
  let currentCaption = null;

  for (const line of lines) {
    if (line.includes("-->")) {

      if (currentCaption) {
        captions.push(currentCaption);
      }
      currentCaption = {
        startTime: parseTime(line.substring(0, 12)) * 1000,
        endTime: parseTime(line.substring(17, 29)) * 1000,
        text: "",
      };
    } else if (
      currentCaption &&
      line.trim() !== "" &&
      !line.startsWith("WEBVTT")
    ) {
      currentCaption.text += line + " ";
    }
  }

  if (currentCaption) {
    captions.push(currentCaption);
  }

  return captions;
}

function parseTime(timeString: string) {
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseFloat(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}
