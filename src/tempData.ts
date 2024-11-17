import { Track } from './track';

const tracks: Track[] = [
  {
    id: 0,
    name: "MacBook Pro",
    trackingNumber: "1Zasdf",
    carrier: "UPS",
    packages: [
      {
        deliveryDate: new Date("2024-11-21"),
        delivered: false,
        activity: []
      },
    ],
  },
  {
    id: 1,
    name: "DisplayPort cable",
    trackingNumber: "92462346326",
    carrier: "FedEx",
    packages: [
      {
        deliveryDate: new Date("2024-11-09"),
        delivered: true,
        activity: []
      },
    ],
  },
  {
    id: 2,
    name: "CalDigit TS4",
    trackingNumber: "156845865089045685454467",
    carrier: "USPS",
    packages: [
      {
        deliveryDate: new Date(),
        delivered: false,
        activity: []
      },
    ],
  },
];

export default tracks;
