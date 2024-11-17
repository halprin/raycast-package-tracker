import Package from "./package";

export interface Track {
  id: number;
  name: string;
  trackingNumber: string;
  carrier: string;
  packages: Package[];
}
