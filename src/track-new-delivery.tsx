import { environment } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import { Track } from "./track";
import { debugTracks } from "./tempData";
import TrackNewDeliveryView from "./views/TrackNewDelivery";

export default function TrackNewDeliveryCommand() {

  const {
    value: tracking,
    setValue: setTracking,
    isLoading,
  } = useLocalStorage<Track[]>("tracking", environment.isDevelopment ? debugTracks : []);

  return (<TrackNewDeliveryView props={{ tracking, setTracking, isLoading }} /> );
}
