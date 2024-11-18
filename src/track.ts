import Package from "./package";

export interface Track {
  id: string;
  name: string;
  trackingNumber: string;
  carrier: string;
  packages: Package[];
}
