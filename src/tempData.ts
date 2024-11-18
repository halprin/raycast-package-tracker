import { Track } from './track';

const tracks: Track[] = [
  {
    id: 0,
    name: "undelivered package that is estimated ahead",
    trackingNumber: "1Zasdf",
    carrier: "UPS",
    packages: [
      {
        deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),  // 4 days ahead
        delivered: false,
        activity: []
      },
    ],
  },
  {
    id: 1,
    name: "delivery date in the past that was delivered",
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
    name: "delivery today that is undelivered",
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
  {
    id: 4,
    name: "delivery that is unknown",
    trackingNumber: "934724536784235786435786",
    carrier: "USPS",
    packages: [
      {
        deliveryDate: undefined,
        delivered: false,
        activity: []
      },
    ],
  },
  {
    id: 5,
    name: "partially delivered",
    trackingNumber: "1Zdflgjadlhjfgasdfasdf",
    carrier: "UPS",
    packages: [
      {
        deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),  // 4 days ahead
        delivered: false,
        activity: []
      },
      {
        deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),  // 2 days ahead
        delivered: false,
        activity: []
      },
      {
        deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),  // 1 days ahead
        delivered: true,
        activity: []
      },
    ],
  },
  {
    id: 6,
    name: "partially delivered, with unknown delivery dates",
    trackingNumber: "134578458906534",
    carrier: "FedEx",
    packages: [
      {
        deliveryDate: undefined,
        delivered: false,
        activity: []
      },
      {
        deliveryDate: undefined,
        delivered: true,
        activity: []
      },
      {
        deliveryDate: undefined,
        delivered: false,
        activity: []
      },
    ],
  },
];

export default tracks;
