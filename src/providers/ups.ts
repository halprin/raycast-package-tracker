import { Package } from "../package";
import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";
import { randomUUID } from "node:crypto";

async function updateUpsTracking(trackingNumber: string): Promise<Package[]> {
  const preferences = getPreferenceValues<Preferences.TrackDeliveries>();
  const clientId = preferences.upsClientId;
  const clientSecret = preferences.upsClientSecret;

  if (!clientId || !clientSecret) {
    return [];
  }

  console.log("Logging into UPS");
  const loginResponse = await login(clientId, clientSecret);

  console.log(`Updating tracking for ${trackingNumber}`);
  const upsTrackingInfo = await track(trackingNumber, loginResponse.access_token);

  const packages = convertUpsTrackingToPackages(upsTrackingInfo);

  console.log(`Updated tracking for ${trackingNumber}`);

  return packages;
}

interface LoginResponseBody {
  token_type: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  expires_in: string;
  status: string;
}

async function login(clientId: string, clientSecret: string): Promise<LoginResponseBody> {
  const response = await fetch("https://wwwcie.ups.com/security/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    console.log(response.status, response.statusText, await response.text());
    throw new Error("Failed to login to UPS");
  }

  const loginResponse = (await response.json()) as LoginResponseBody;
  if (!loginResponse) {
    throw new Error("Failed to parse UPS login response");
  }

  return loginResponse;
}

interface UpsTrackingInfo {
  trackResponse: {
    shipment: [
      {
        inquiryNumber: string;
        package: [
          {
            trackingNumber: string;
            deliveryDate: [
              {
                type: string;
                date: string;
              },
            ];
            activity: [object];
            currentStatus: {
              description: string;
              code: string;
            };
          },
        ];
      },
    ];
  };
}

async function track(trackingNumber: string, accessToken: string): Promise<UpsTrackingInfo> {
  const response = await fetch(
    `https://wwwcie.ups.com/api/track/v1/details/${trackingNumber}?locale=en_US&returnSignature=false`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        transactionSrc: "raycast",
        transId: randomUUID().toString(),
      },
    },
  );

  if (!response.ok) {
    console.log(response.status, response.statusText, await response.text());
    throw new Error(`Failed to get UPS tracking for ${trackingNumber}`);
  }

  const trackingResponse = (await response.json()) as UpsTrackingInfo;
  if (!trackingResponse) {
    throw new Error(`Failed to parse UPS track response for ${trackingNumber}`);
  }

  return trackingResponse;
}

function convertUpsTrackingToPackages(upsTrackingInfo: UpsTrackingInfo): Package[] {
  return upsTrackingInfo.trackResponse.shipment
    .flatMap((shipment) => shipment.package)
    .map((aPackage) => {
      const deliveryDate = aPackage.deliveryDate.find((deliveryDate) => deliveryDate.type === "DEL")?.date;
      const rescheduledDeliveryDate = aPackage.deliveryDate.find((deliveryDate) => deliveryDate.type === "RDD")?.date;
      const scheduledDeliveryDate = aPackage.deliveryDate.find((deliveryDate) => deliveryDate.type === "SDD")?.date;

      return {
        delivered: aPackage.currentStatus.code === "011",
        deliveryDate: convertUpsDateToDate(deliveryDate || rescheduledDeliveryDate || scheduledDeliveryDate),
        activity: [],
      };
    });
}

function convertUpsDateToDate(upsDate: string | undefined): Date | undefined {
  if (!upsDate) {
    return undefined;
  }

  const year = parseInt(upsDate.substring(0, 4), 10);
  const month = parseInt(upsDate.substring(4, 6), 10) - 1; // Months are 0-indexed in TypeScript
  const day = parseInt(upsDate.substring(6, 8), 10);

  return new Date(year, month, day);
}

export default updateUpsTracking;
