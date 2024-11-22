export interface Delivery {
  id: string;
  name: string;
  trackingNumber: string;
  carrier: string;
  debug?: boolean;
}
