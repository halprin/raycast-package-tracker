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
  const tracking = await getTracking();

  tracking.push(track);

  await LocalStorage.setItem("tracking", JSON.stringify(tracking));
}

export async function removeTracking(id: string) {
  const tracking = await getTracking();

  const reducedTracking = tracking.filter((track) => track.id !== id);

  await LocalStorage.setItem("tracking", JSON.stringify(reducedTracking));
}
