import React, { useEffect, useState } from "react";
import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import tempData from "./tempData";
import providers from "./providers";
import Package from "./package";
import { Track } from "./track";

export default function Command() {
  const [tracking, setTracking] = useState<Track[]>([]);

  useEffect(() => {
    fetchTracking(setTracking);
  }, []);

  return (
    <List>
      {tracking.map(item => (
        <List.Item
          key={ item.id }
          id={ item.id.toString() }
          icon={ deliveryIcon(item.packages) }
          title={ item.name }
          subtitle={ item.trackingNumber }
          accessories={ [
            { text: deliveryAccessory(item.packages) },
            { text: { value: item.carrier, color: providers.get(item.carrier)?.color } },
          ] }
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<Detail markdown={`# ${item.name}`} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

async function fetchTracking(setTracking: React.Dispatch<React.SetStateAction<Track[]>>) {
  const sortedTracking = sortTracking(tempData);
  setTracking(sortedTracking)
}

function sortTracking(tracks: Track[]): Track[] {
  return tracks.toSorted((aTrack, bTrack) => {

    const aAllPackagesDelivered = aTrack.packages.every(aPackage => aPackage.delivered)
    const bAllPackagesDelivered = bTrack.packages.every(bPackage => bPackage.delivered)

    if (aAllPackagesDelivered && !bAllPackagesDelivered) {
      // a has all packages delivered, and b doesn't
      return -1;
    } else if (!aAllPackagesDelivered && bAllPackagesDelivered) {
      // a doesn't have all packages delivered, and b does
      return 1;
    }

    const aEarliestDeliveryDate = getPackageWithEarliestDeliveryDate(aTrack.packages).deliveryDate;
    const bEarliestDeliveryDate = getPackageWithEarliestDeliveryDate(bTrack.packages).deliveryDate;

    if (aEarliestDeliveryDate && !bEarliestDeliveryDate) {
      // a has a delivery date, and b doesn't
      return -1;
    } else if (!aEarliestDeliveryDate && bEarliestDeliveryDate) {
      // a doesn't have a delivery date, and b does
      return 1;
    } else if (!aEarliestDeliveryDate && !bEarliestDeliveryDate) {
      // a doesn't have a delivery date, and b doesn't either

      const aSomePackagesDelivered = aTrack.packages.some(aPackage => aPackage.delivered)
      const bSomePackagesDelivered = bTrack.packages.some(bPackage => bPackage.delivered)

      if (aSomePackagesDelivered && !bSomePackagesDelivered) {
        // a has some packages delivered, and b doesn't
        return -1;
      } else if (!aSomePackagesDelivered && bSomePackagesDelivered) {
        // a doesn't have any packages delivered, and b does
        return 1
      }

      // a and b both don't have any packages delivered
      return 0;
    }

    const dayDifferenceDifference = calculateDayDifference(aEarliestDeliveryDate!) - calculateDayDifference(bEarliestDeliveryDate!);
    if (dayDifferenceDifference == 0) {
      // both tracks tie for earliest delivery

      const aSomePackagesDelivered = aTrack.packages.some(aPackage => aPackage.delivered)
      const bSomePackagesDelivered = bTrack.packages.some(bPackage => bPackage.delivered)

      if (aSomePackagesDelivered && !bSomePackagesDelivered) {
        // a has some packages delivered, and b doesn't
        return -1;
      } else if (!aSomePackagesDelivered && bSomePackagesDelivered) {
        // a doesn't have any packages delivered, and b does
        return 1
      }

      // a and b both don't have any packages delivered
      return 0;
    }

    return dayDifferenceDifference;
  });
}

function deliveryIcon(packages: Package[]): Icon {

  const somePackagesDelivered = packages.some(aPackage => aPackage.delivered)
  let allPackagesDelivered = false;
  if (somePackagesDelivered) {
    allPackagesDelivered = packages.every(aPackage => aPackage.delivered)
  }

  if (allPackagesDelivered) {
    return Icon.CheckCircle;
  } else if (somePackagesDelivered) {
    return Icon.Circle;
  }

  return Icon.CircleProgress;
}

function deliveryAccessory(packages: Package[]): { value: string, color?: Color } {
  // check whether all, some, or no packages in a track are delivered

  const somePackagesDelivered = packages.some(aPackage => aPackage.delivered)
  let allPackagesDelivered = false;
  if (somePackagesDelivered) {
    allPackagesDelivered = packages.every(aPackage => aPackage.delivered)
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
    accessoryText = accessoryText + "; some packages delivered"
    accessoryColor = Color.Blue
  }

  return {
    value: accessoryText,
    color: accessoryColor
  };
}

function getPackageWithEarliestDeliveryDate(packages: Package[]) {
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

    if (Math.abs(currentDeliveryDate.getTime() - now.getTime()) < Math.abs(closestDeliveryDate.getTime() - now.getTime())) {
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
