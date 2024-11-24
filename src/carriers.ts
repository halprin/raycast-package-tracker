import { Color } from "@raycast/api";
import { Package } from "./package";
import updateUspsTracking from "./carriers/usps";
import updateUpsTracking from "./carriers/ups";
import updateFedexTracking from "./carriers/fedex";

interface Carrier {
  id: string;
  name: string;
  color: Color;
  updateTracking: (trackingNumber: string) => Promise<Package[]>;
}

const carriers: Carrier[] = [
  {
    id: "usps",
    name: "USPS",
    color: Color.Blue,
    updateTracking: updateUspsTracking,
  },
  {
    id: "ups",
    name: "UPS",
    color: Color.Orange,
    updateTracking: updateUpsTracking,
  },
  {
    id: "fedex",
    name: "FedEx",
    color: Color.Purple,
    updateTracking: updateFedexTracking,
  },
];

export default new Map(carriers.map((carrier) => [carrier.id, carrier]));
