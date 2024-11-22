import { Action, Icon, Keyboard } from "@raycast/api";
import TrackNewDeliveryView from "./TrackNewDeliveryView";
import { Track } from "../track";

export default function TrackNewDeliveryAction({
  tracking,
  setTracking,
  isLoading,
}: {
  tracking?: Track[];
  setTracking: (value: Track[]) => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <Action.Push
      title="Track New Delivery"
      icon={Icon.Plus}
      shortcut={Keyboard.Shortcut.Common.New}
      target={<TrackNewDeliveryView tracking={tracking} setTracking={setTracking} isLoading={isLoading} />}
    />
  );
}
