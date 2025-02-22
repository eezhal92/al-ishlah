import { SubtitleEntry } from "./AudioSubs.types";

export function getSubtitleBinarySearch(currentTime: number, subtitles: SubtitleEntry[]) {
  let left = 0, right = subtitles.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const subtitle = subtitles[mid];

    if (currentTime >= subtitle.startTime && currentTime <= subtitle.endTime) {
      return subtitle.text;
    } else if (currentTime < subtitle.startTime) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return null; // If no matching subtitle is found
}
