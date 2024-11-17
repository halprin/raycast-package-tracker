import { Color } from "@raycast/api";

interface Provider {
  name: string;
  color: Color;
}

const providers: Provider[] = [
  {
    name: "USPS",
    color: Color.Blue,
  },
  {
    name: "UPS",
    color: Color.Yellow,
  },
  {
    name: "FedEx",
    color: Color.Purple,
  },
];

export default new Map(providers.map(provider => [provider.name, provider]));