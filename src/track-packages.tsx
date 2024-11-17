import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import tempData from "./tempData";
import providers from "./providers";
import Package from "./package";

export default function Command() {
  return (
    <List>
      {tempData.map(item => (
        <List.Item
          key={item.id}
          id={item.id.toString()}
          icon={ deliveryIcon(item.packages) }
          title={item.name}
          subtitle={item.trackingNumber}
          accessories={[
            { text: deliveryAccessory(item.packages) },
            { text: { value: item.carrier, color: providers.get(item.carrier)?.color } },
          ]}
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
  const now = new Date();
  const closestPackage = packages.reduce((closest, current) => {
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
      return current
    } else {
      return closest;
    }
  });

  if (!closestPackage.deliveryDate) {
    // no known delivery date across all the packages
    return {
      value: "En route",
    }
  }

  let accessoryText = calculateDayDifference(closestPackage.deliveryDate).toString() + " days until delivery";
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

function calculateDayDifference(deliverDate: Date): number {
  const millisecondsInDay = 1000 * 60 * 60 * 24;

  const millisecondsDifference = deliverDate.getTime() - new Date().getTime();
  let dayDifference = Math.ceil(millisecondsDifference / millisecondsInDay);

  if (dayDifference < 0) {
    dayDifference = 0;
  }

  return dayDifference;
}
