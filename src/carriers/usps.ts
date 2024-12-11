import { Package } from "../package";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import * as cheerio from "cheerio";

async function updateUspsTracking(trackingNumber: string): Promise<Package[]> {
  console.log(`Updating tracking for ${trackingNumber}`);

  console.log("Calling USPS tracking");
  const aPackage = await track(trackingNumber);

  console.log(`Updated tracking for ${trackingNumber}`);

  return [aPackage];
}

async function track(trackingNumber: string): Promise<Package> {
  const url = `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.log("Failed to get USPS tracking", response.status, response.statusText, await response.text());
    throw new Error(`Failed to get USPS tracking with status ${response.statusText}.`);
  }

  const initialHtml = await response.text();

  console.log("here we are");

  const dom = new JSDOM(initialHtml, {
    url: url,
    runScripts: "dangerously",
  });

  const html = dom.serialize();

  const $ = cheerio.load(initialHtml);

  const expected_delivery = $("div.expected_delivery");
  const day = expected_delivery.find("strong.date").text();
  const month_year = expected_delivery.find("span.month_year");
  const month_name = month_year.find("span").text();
  const year = month_year.text();

  console.log(day, month_name, year);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames.indexOf(month_name);

  return { activity: [], delivered: false, deliveryDate: new Date(parseInt(year), month, parseInt(day)) };
}

export default updateUspsTracking;
