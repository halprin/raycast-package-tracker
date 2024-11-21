import { Track } from "./track";
import { PackageMap } from "./package";

export const debugTracks: Track[] = [
  {
    id: "E2836A4F-8BC9-463D-A703-EDFF8D1580D9",
    name: "undelivered package that is estimated ahead",
    trackingNumber: "1Zasdf",
    carrier: "ups",
    debug: true,
  },
  {
    id: "E04FEF49-47DD-4D67-A60B-5D9CC6F78C1E",
    name: "delivery date in the past that was delivered",
    trackingNumber: "92462346326",
    carrier: "fedex",
    debug: true,
  },
  {
    id: "D9A04926-2A37-40C1-B2C5-DB2E1924F0A8",
    name: "delivery today that is undelivered",
    trackingNumber: "156845865089045685454467",
    carrier: "usps",
    debug: true,
  },
  {
    id: "195A6D9E-81BC-4CEC-97B7-DB5D5A96E8BC",
    name: "delivery that is unknown",
    trackingNumber: "934724536784235786435786",
    carrier: "usps",
    debug: true,
  },
  {
    id: "13DCF84F-EEE5-4827-AD08-4C0F336E87BB",
    name: "partially delivered",
    trackingNumber: "1Zdflgjadlhjfgasdfasdf",
    carrier: "ups",
    debug: true,
  },
  {
    id: "CF022134-EEE4-4AA1-BD74-64BF36B465FD",
    name: "partially delivered, with unknown delivery dates",
    trackingNumber: "134578458906534",
    carrier: "fedex",
    debug: true,
  },
];

export const debugPackages: PackageMap = {};
debugPackages[debugTracks[0].id] = [
  {
    deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4), // 4 days ahead
    delivered: false,
    activity: [],
  },
];
debugPackages[debugTracks[1].id] = [
  {
    deliveryDate: new Date("2024-11-09"),
    delivered: true,
    activity: [],
  },
];
debugPackages[debugTracks[2].id] = [
  {
    deliveryDate: new Date(),
    delivered: false,
    activity: [],
  },
];
debugPackages[debugTracks[3].id] = [
  {
    deliveryDate: undefined,
    delivered: false,
    activity: [],
  },
];
debugPackages[debugTracks[4].id] = [
  {
    deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4), // 4 days ahead
    delivered: false,
    activity: [],
  },
  {
    deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4), // 2 days ahead
    delivered: false,
    activity: [],
  },
  {
    deliveryDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4), // 1 days ahead
    delivered: true,
    activity: [],
  },
];
debugPackages[debugTracks[5].id] = [
  {
    deliveryDate: undefined,
    delivered: false,
    activity: [],
  },
  {
    deliveryDate: undefined,
    delivered: true,
    activity: [],
  },
  {
    deliveryDate: undefined,
    delivered: false,
    activity: [],
  },
];
