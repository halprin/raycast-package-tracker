import {
  Action,
  ActionPanel,
  Icon,
  List,
  environment,
  Keyboard,
  showToast,
  Toast,
  confirmAlert,
  Alert,
} from "@raycast/api";
import { debugDeliveries, debugPackages } from "./debugData";
import carriers from "./carriers";
import {
  calculateDayDifference,
  deliveryIcon,
  deliveryStatus,
  getPackageWithEarliestDeliveryDate,
  PackageMap,
} from "./package";
import { Delivery } from "./delivery";
import { useCachedState, useLocalStorage } from "@raycast/utils";
import { useEffect, useState } from "react";
import TrackNewDeliveryAction from "./views/TrackNewDeliveryAction";
import ShowDetailsView from "./views/ShowDetailsView";
import EditDeliveryView from "./views/EditDeliveryView";

export default function TrackDeliveriesCommand() {
  const {
    value: deliveries,
    setValue: setDeliveries,
    isLoading,
  } = useLocalStorage<Delivery[]>("deliveries", environment.isDevelopment ? debugDeliveries : []);

  const [packages, setPackages] = useCachedState<PackageMap>(
    "packages",
    environment.isDevelopment ? debugPackages : {},
  );

  const [trackingIsLoading, setTrackingIsLoading] = useState(false);

  useEffect(() => {
    if (!deliveries || !packages) {
      // don't do anything until both deliveries and packages are initialized
      return;
    }

    setTrackingIsLoading(true);
    refreshTracking(false, deliveries, packages, setPackages, setTrackingIsLoading);
  }, [deliveries]);

  return (
    <List
      isLoading={isLoading || trackingIsLoading}
      actions={
        <ActionPanel>
          <TrackNewDeliveryAction deliveries={deliveries} setDeliveries={setDeliveries} isLoading={isLoading} />
        </ActionPanel>
      }
    >
      {(deliveries ?? []).length === 0 ? (
        <List.EmptyView
          icon={"extension-icon.png"}
          title="No Deliveries"
          description={
            "Track a new delivery ⏎, and don't forget to fill in the API keys for the used carriers in the extension settings."
          }
        />
      ) : (
        sortTracking(deliveries ?? [], packages).map((delivery) => (
          <List.Item
            key={delivery.id}
            id={delivery.id}
            icon={deliveryIcon(packages[delivery.id]?.packages)}
            title={delivery.name}
            subtitle={delivery.trackingNumber}
            accessories={[
              { text: deliveryStatus(packages[delivery.id]?.packages) },
              { text: { value: carriers.get(delivery.carrier)?.name, color: carriers.get(delivery.carrier)?.color } },
            ]}
            actions={
              <ActionPanel>
                <Action.Push
                  title="Show Details"
                  icon={Icon.MagnifyingGlass}
                  target={<ShowDetailsView delivery={delivery} packages={packages[delivery.id]?.packages ?? []} />}
                />
                <Action.Push
                  title="Edit Delivery"
                  icon={Icon.Pencil}
                  shortcut={Keyboard.Shortcut.Common.Edit}
                  target={
                    <EditDeliveryView
                      delivery={delivery}
                      deliveries={deliveries ?? []}
                      setDeliveries={setDeliveries}
                      setPackages={setPackages}
                      isLoading={isLoading}
                    />
                  }
                />
                <Action
                  title="Delete Delivery"
                  icon={Icon.Trash}
                  shortcut={Keyboard.Shortcut.Common.Remove}
                  style={Action.Style.Destructive}
                  onAction={() => deleteTracking(delivery.id, deliveries, setDeliveries)}
                />
                <TrackNewDeliveryAction deliveries={deliveries} setDeliveries={setDeliveries} isLoading={isLoading} />
                <Action
                  title="Refresh All"
                  icon={Icon.RotateClockwise}
                  shortcut={Keyboard.Shortcut.Common.Refresh}
                  style={Action.Style.Regular}
                  onAction={() => {
                    if (!deliveries || !packages) {
                      // don't do anything until both deliveries and packages are initialized
                      return;
                    }

                    setTrackingIsLoading(true);
                    refreshTracking(true, deliveries, packages, setPackages, setTrackingIsLoading);
                  }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

async function refreshTracking(
  forceRefresh: boolean,
  deliveries: Delivery[],
  packages: PackageMap,
  setPackages: (value: ((prevState: PackageMap) => PackageMap) | PackageMap) => void,
  setTrackingIsLoading: (value: ((prevState: boolean) => boolean) | boolean) => void,
) {
  const now = new Date();

  for (const delivery of deliveries.filter((delivery) => !delivery.debug)) {
    const carrier = carriers.get(delivery.carrier);
    if (!carrier) {
      continue;
    }

    const currentTrackPackages = packages[delivery.id];

    if (
      !forceRefresh &&
      currentTrackPackages &&
      currentTrackPackages.lastUpdated &&
      now.getTime() - currentTrackPackages.lastUpdated.getTime() <= 30 * 60 * 1000
    ) {
      // we have packages for this track (else cache is gone, and we need to refresh),
      // we've recorded the last update time (else we have never refreshed),
      // and it's been less than 30 minutes,
      // then...
      // skip updating
      continue;
    }

    try {
      const refreshedPackages = await carrier.updateTracking(delivery.trackingNumber);

      setPackages((packagesMap) => {
        packagesMap[delivery.id] = {
          packages: refreshedPackages,
          lastUpdated: now,
        };
        return packagesMap;
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: `Failed to Update Tracking for ${delivery.trackingNumber}`,
        message: String(error),
      });
    }
  }

  setTrackingIsLoading(false);
}

async function deleteTracking(
  id: string,
  tracking: Delivery[] | undefined,
  setTracking: (value: Delivery[]) => Promise<void>,
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

function sortTracking(tracks: Delivery[], packages: PackageMap): Delivery[] {
  return tracks.toSorted((aTrack, bTrack) => {
    const aPackages = packages[aTrack.id]?.packages ?? [];
    const bPackages = packages[bTrack.id]?.packages ?? [];

    if (aPackages.length > 0 && bPackages.length === 0) {
      // a has packages, and b doesn't
      return -1;
    } else if (aPackages.length === 0 && bPackages.length > 0) {
      // a doesn't have any packages, and b does
      return 1;
    } else if (aPackages.length === 0 && bPackages.length === 0) {
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
    if (dayDifferenceDifference === 0) {
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
