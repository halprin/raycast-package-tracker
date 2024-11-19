import { Color } from "@raycast/api";
import Package from "./package";
import updateUspsTracking from "./providers/usps";
import updateUpsTracking from "./providers/ups";
import updateFedexTracking from "./providers/fedex";

interface Provider {
  name: string;
  color: Color;
  updateTracking: (trackingNumber: string) => Promise<Package[]>;
}

const providers: Provider[] = [
  {
    name: "USPS",
    color: Color.Blue,
    updateTracking: updateUspsTracking,
  },
  {
    name: "UPS",
    color: Color.Yellow,
    updateTracking: updateUpsTracking,
  },
  {
    name: "FedEx",
    color: Color.Purple,
    updateTracking: updateFedexTracking,
  },
];

export default new Map(providers.map((provider) => [provider.name, provider]));
