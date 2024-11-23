import { Detail } from "@raycast/api";
import { Delivery } from "../delivery";
import { deliveryIcon, deliveryStatus, PackageMapValue } from "../package";
import providers from "../providers";

export default function ShowDetailsView({ delivery, packages }: { delivery: Delivery; packages: PackageMapValue }) {
  const markdown = `# ${delivery.name}
  lol`;

  return (
    <Detail
      navigationTitle={delivery.name}
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Carrier"
            text={{
              value: providers.get(delivery.carrier)?.name ?? "Unknown",
              color: providers.get(delivery.carrier)?.color,
            }}
          />
          <Detail.Metadata.Label title="Tracking Number" text={delivery.trackingNumber} />
          <Detail.Metadata.Label
            title="Status"
            text={deliveryStatus(packages.packages)}
            icon={deliveryIcon(packages.packages)}
          />
        </Detail.Metadata>
      }
    />
  );
}