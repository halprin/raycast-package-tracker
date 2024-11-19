import { Color } from "@raycast/api";
import { Package } from "./package";
import updateUspsTracking from "./providers/usps";
import updateUpsTracking from "./providers/ups";
import updateFedexTracking from "./providers/fedex";

interface Provider {
  id: string;
  name: string;
  color: Color;
  updateTracking: (trackingNumber: string) => Promise<Package[]>;
}

const providers: Provider[] = [
  {
    id: "usps",
    name: "USPS",
    color: Color.Blue,
    updateTracking: updateUspsTracking,
  },
  {
    id: "ups",
    name: "UPS",
    color: Color.Yellow,
    updateTracking: updateUpsTracking,
  },
  {
    id: "fedex",
    name: "FedEx",
    color: Color.Purple,
    updateTracking: updateFedexTracking,
  },
];

export default new Map(providers.map((provider) => [provider.id, provider]));
