interface Track {
  id: number;
  name: string;
  trackingNumber: string;
  type: string;
  deliveryDate: Date;
}

const tracks: Track[] = [
  {
    id: 0,
    name: "MacBook Pro",
    trackingNumber: "1Zasdf",
    type: "UPS",
    deliveryDate: new Date("2024-11-21"),
  },
  {
    id: 1,
    name: "DisplayPort cable",
    trackingNumber: "92462346326",
    type: "FedEx",
    deliveryDate: new Date("2024-11-09"),
  },
  {
    id: 2,
    name: "CalDigit TS4",
    trackingNumber: "156845865089045685454467",
    type: "USPS",
    deliveryDate: new Date(),
  },
];

export default tracks;
