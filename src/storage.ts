import { Track } from "./track";
import { LocalStorage } from "@raycast/api";

export async function getTracking(): Promise<Track[]> {
  const trackingString = await LocalStorage.getItem<string>("tracking");

  if (!trackingString) {
    return [];
  }

  return JSON.parse(trackingString);
}

export async function addTracking(track: Track) {
  const trackingString = await LocalStorage.getItem<string>("tracking");

  let tracking: Track[] = [];

  if (trackingString) {
    tracking = JSON.parse(trackingString);
  }

  tracking.push(track);

  await LocalStorage.setItem("tracking", JSON.stringify(tracking));
}