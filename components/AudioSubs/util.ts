import { Caption } from "@/types/short";

export function getSubtitleBinarySearch(currentTime: number, captions: Caption[]) {
  let left = 0, right = captions.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const subtitle = captions[mid];

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
