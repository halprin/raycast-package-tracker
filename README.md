# Delivery Tracker

[Original repository](https://github.com/halprin/raycast-delivery-tracker).

Tracks deliveries, packages, and parcels in Raycast.  Remembers your deliveries, so you can keep watch as they make
their way to you.

This extension does not use a single third-party tracking service.  It directly integrates with each supported carrier,
which allows you to be in charge of your privacy.

## Supported Carriers

### United States Postal Service (USPS)

In the settings, you'll need two things to access the USPS API.
- Consumer key.
- Consumer secret.

Navigate to the [USPS Developer Portal](https://developer.usps.com/) and walk through the getting started steps.

Do not do the steps in the Customer Access Testing (CAT) environment, or you will get incorrect tracking information.
The name of the app can be anything and is only for you.  You do not need a callback URL.  As outlined in their steps,
you will need to contact their [API support](mailto:APISupport@usps.gov) to add access to the tracking API.

### United Parcel Service (UPS)

### Federal Express (FedEx)

## Contributing

Feel free to file an issue or fork and PR on the
[original repository](https://github.com/halprin/raycast-delivery-tracker) or through the
[main extension repository](https://github.com/raycast/extensions) workflow.

If you are adding support for a new carrier, you can take inspiration from the [existing carriers](./src/providers).
Please update the documentation here on how one signs-up for the carrier and gets any API keys.
