import {
  Action,
  ActionPanel,
  Color,
  Detail,
  Icon,
  List,
  environment,
  Keyboard,
  showToast,
  Toast,
  confirmAlert,
  Alert,
} from "@raycast/api";
import { debugTracks, debugPackages } from "./debugData";
import providers from "./providers";
import { Package } from "./package";
import { Track } from "./track";
import { useCachedState, useLocalStorage } from "@raycast/utils";
import TrackNewDeliveryView from "./views/TrackNewDelivery";

export default function TrackDeliveriesCommand() {
  const {
    value: tracking,
    setValue: setTracking,
    isLoading,
  } = useLocalStorage<Track[]>("tracking", environment.isDevelopment ? debugTracks : []);

  const [packages] = useCachedState<Map<string, Package[]>>(
    "packages",
    environment.isDevelopment ? debugPackages : new Map<string, Package[]>(),
  );

  return (
    <List isLoading={isLoading}>
      {sortTracking(tracking ?? [], packages).map((item) => (
        <List.Item
          key={item.id}
          id={item.id.toString()}
          icon={deliveryIcon(packages.get(item.id))}
          title={item.name}
          subtitle={item.trackingNumber}
          accessories={[
            { text: deliveryAccessory(packages.get(item.id)) },
            { text: { value: providers.get(item.carrier)?.name, color: providers.get(item.carrier)?.color } },
          ]}
          actions={
            <ActionPanel>
              <Action.Push
                title="Show Details"
                icon={Icon.MagnifyingGlass}
                target={<Detail markdown={`# ${item.name}`} />}
              />
              <Action
                title="Delete Delivery"
                icon={Icon.Trash}
                shortcut={Keyboard.Shortcut.Common.Remove}
                style={Action.Style.Destructive}
                onAction={() => deleteTracking(item.id, tracking, setTracking)}
              />
              <Action.Push
                title="Track New Delivery"
                icon={Icon.Plus}
                shortcut={Keyboard.Shortcut.Common.New}
                target={<TrackNewDeliveryView props={{ tracking, setTracking, isLoading }} />}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

async function deleteTracking(
  id: string,
  tracking: Track[] | undefined,
  setTracking: (value: Track[]) => Promise<void>,
) {
  if (!tracking) {
    return;
  }

  const nameOfTrackToDelete = tracking.find((track) => track.id === id)?.name ?? "Unknown";

  const options: Alert.Options = {
    title: "Delete Delivery",
    message: `Are you sure you want to delete ${nameOfTrackToDelete}?`,
    icon: Icon.Trash,
    primaryAction: {
      title: "Delete",
      style: Alert.ActionStyle.Destructive,
    },
  };

  const confirmation = await confirmAlert(options);
  if (!confirmation) {
    return;
  }

  const reducedTracking = tracking.filter((track) => track.id !== id);
  await setTracking(reducedTracking);

  await showToast({
    style: Toast.Style.Success,
    title: "Deleted Delivery",
    message: nameOfTrackToDelete,
  });
}

function sortTracking(tracks: Track[], packages: Map<string, Package[]>): Track[] {
  return tracks.toSorted((aTrack, bTrack) => {
    const aPackages = packages.get(aTrack.id) ?? [];
    const bPackages = packages.get(bTrack.id) ?? [];

    if (aPackages.length > 0 && bPackages.length == 0) {
      // a has packages, and b doesn't
      return -1;
    } else if (aPackages.length == 0 && bPackages.length > 0) {
      // a doesn't have any packages, and b does
      return 1;
    } else if (aPackages.length == 0 && bPackages.length == 0) {
      //a doesn't have any packages, and b doesn't either
      return 0;
    }

    const aAllPackagesDelivered = aPackages.every((aPackage) => aPackage.delivered);
    const bAllPackagesDelivered = bPackages.every((bPackage) => bPackage.delivered);

    if (aAllPackagesDelivered && !bAllPackagesDelivered) {
      // a has all packages delivered, and b doesn't
      return -1;
    } else if (!aAllPackagesDelivered && bAllPackagesDelivered) {
      // a doesn't have all packages delivered, and b does
      return 1;
    }

    const aEarliestDeliveryDate = getPackageWithEarliestDeliveryDate(aPackages).deliveryDate;
    const bEarliestDeliveryDate = getPackageWithEarliestDeliveryDate(bPackages).deliveryDate;

    if (aEarliestDeliveryDate && !bEarliestDeliveryDate) {
      // a has a delivery date, and b doesn't
      return -1;
    } else if (!aEarliestDeliveryDate && bEarliestDeliveryDate) {
      // a doesn't have a delivery date, and b does
      return 1;
    } else if (!aEarliestDeliveryDate && !bEarliestDeliveryDate) {
      // a doesn't have a delivery date, and b doesn't either

      const aSomePackagesDelivered = aPackages.some((aPackage) => aPackage.delivered);
      const bSomePackagesDelivered = bPackages.some((bPackage) => bPackage.delivered);

      if (aSomePackagesDelivered && !bSomePackagesDelivered) {
        // a has some packages delivered, and b doesn't
        return -1;
      } else if (!aSomePackagesDelivered && bSomePackagesDelivered) {
        // a doesn't have any packages delivered, and b does
        return 1;
      }

      // a and b both don't have any packages delivered
      return 0;
    }

    const dayDifferenceDifference =
      calculateDayDifference(aEarliestDeliveryDate!) - calculateDayDifference(bEarliestDeliveryDate!);
    if (dayDifferenceDifference == 0) {
      // both tracks tie for earliest delivery

      const aSomePackagesDelivered = aPackages.some((aPackage) => aPackage.delivered);
      const bSomePackagesDelivered = bPackages.some((bPackage) => bPackage.delivered);

      if (aSomePackagesDelivered && !bSomePackagesDelivered) {
        // a has some packages delivered, and b doesn't
        return -1;
      } else if (!aSomePackagesDelivered && bSomePackagesDelivered) {
        // a doesn't have any packages delivered, and b does
        return 1;
      }

      // a and b both don't have any packages delivered
      return 0;
    }

    return dayDifferenceDifference;
  });
}

function deliveryIcon(packages?: Package[]): Icon {
  if (!packages || packages.length == 0) {
    // there are no packages for this tracking, possible before data has been gotten from API
    return Icon.QuestionMarkCircle;
  }

  const somePackagesDelivered = packages.some((aPackage) => aPackage.delivered);
  let allPackagesDelivered = false;
  if (somePackagesDelivered) {
    allPackagesDelivered = packages.every((aPackage) => aPackage.delivered);
  }

  if (allPackagesDelivered) {
    return Icon.CheckCircle;
  } else if (somePackagesDelivered) {
    return Icon.Circle;
  }

  return Icon.CircleProgress;
}

function deliveryAccessory(packages?: Package[]): { value: string; color?: Color } {
  // check whether all, some, or no packages in a track are delivered

  if (!packages || packages.length == 0) {
    return {
      value: "No packages",
      color: Color.Orange,
    };
  }

  const somePackagesDelivered = packages.some((aPackage) => aPackage.delivered);
  let allPackagesDelivered = false;
  if (somePackagesDelivered) {
    allPackagesDelivered = packages.every((aPackage) => aPackage.delivered);
  }

  if (allPackagesDelivered) {
    return {
      value: "Delivered",
      color: Color.Green,
    };
  }

  //find closest estimated delivered package
  const closestPackage = getPackageWithEarliestDeliveryDate(packages);

  let accessoryText = "En route";
  if (closestPackage.deliveryDate) {
    accessoryText = calculateDayDifference(closestPackage.deliveryDate).toString() + " days until delivery";
  }

  let accessoryColor = undefined;
  if (somePackagesDelivered && !allPackagesDelivered) {
    accessoryText = accessoryText + "; some packages delivered";
    accessoryColor = Color.Blue;
  }

  return {
    value: accessoryText,
    color: accessoryColor,
  };
}

function getPackageWithEarliestDeliveryDate(packages: Package[]): Package {
  const now = new Date();

  return packages.reduce((closest, current) => {
    const closestDeliveryDate = closest.deliveryDate;
    const currentDeliveryDate = current.deliveryDate;

    if (!currentDeliveryDate) {
      // current package has an unknown delivery date
      return closest;
    }

    if (!closestDeliveryDate) {
      // previous package has an unknown delivery date
      return current;
    }

    if (
      Math.abs(currentDeliveryDate.getTime() - now.getTime()) < Math.abs(closestDeliveryDate.getTime() - now.getTime())
    ) {
      return current;
    } else {
      return closest;
    }
  });
}

function calculateDayDifference(deliverDate: Date): number {
  const millisecondsInDay = 1000 * 60 * 60 * 24;

  const millisecondsDifference = deliverDate.getTime() - new Date().getTime();
  let dayDifference = Math.ceil(millisecondsDifference / millisecondsInDay);

  if (dayDifference < 0) {
    dayDifference = 0;
  }

  return dayDifference;
}
