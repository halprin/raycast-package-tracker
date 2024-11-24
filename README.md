# Delivery Tracker

[Original repository](https://github.com/halprin/raycast-delivery-tracker).

Tracks deliveries, packages, and parcels in Raycast.  Remembers your deliveries, so you can keep watch as they make
their way to you.

This extension does not use a third-party tracking service as a proxy.  It directly integrates with each supported
carrier, which allows you to be in charge of your privacy.

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

In the settings, you'll need two things to access the UPS API.
- Client ID.
- Client secret.

Navigate to the [UPS Developer Portal](https://developer.ups.com/) and walk through the getting started steps.

The name of the app can be anything and is only for you.  You do not need a callback URL.  Pick the option that you want
to integrate UPS in your business because you are _not_ representing other users for why you need API credentials.  Make
sure to add the Tracking API product.  You'll need a shipper account tied to your normal UPS account; UPS will walk you
through this process if you don't have one yet.

### Federal Express (FedEx)

In the settings, you'll need two things to access the FedEx API.
- API key.
- Secret key.

Navigate to the [FedEx Developer Portal](https://developer.fedex.com/) and walk through the getting started steps.

Select the track API when creating the API project.  The name of the project can be anything and is only for you.  After
creating the project, you'll need to subsequently create the production key and use that in this extension.  Do not use
the test key, or you'll get incorrect tracking information.  The name of the production key name can be anything.

## Contributing

Feel free to file an issue or fork and PR on the
[original repository](https://github.com/halprin/raycast-delivery-tracker) or through the
[main extension repository](https://github.com/raycast/extensions) workflow.

If you are adding support for a new carrier, you can take inspiration from the [existing carriers](./src/carriers).
Please update the documentation here on how one signs-up for the carrier and gets any API keys.
