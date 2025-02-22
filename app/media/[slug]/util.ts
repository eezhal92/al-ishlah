import { Caption, ShortMedia } from "@/types/short";
import { SupabaseClient } from "@/utils/supabase/server";

export async function getMediaEntry(client: SupabaseClient, slug: string): Promise<ShortMedia | null> {
  const row = await client.from('shorts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!row.data) return null

  const captions = parseVTT(row.data.captions_vtt)

  return {
    speakerName: row.data.speaker_name,
    title: row.data.title,
    audioURL: row.data.audio_url,
    captions: captions,
  }
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
