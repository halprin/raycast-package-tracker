import { environment } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import { Track } from "./track";
import { debugTracks } from "./debugData";
import TrackNewDeliveryView from "./views/TrackNewDeliveryView";

export default function TrackNewDeliveryCommand() {
  const {
    value: tracking,
    setValue: setTracking,
    isLoading,
  } = useLocalStorage<Track[]>("tracking", environment.isDevelopment ? debugTracks : []);

  return <TrackNewDeliveryView tracking={tracking} setTracking={setTracking} isLoading={isLoading} />;
}
