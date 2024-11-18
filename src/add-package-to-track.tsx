import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import providers from "./providers";
import { FormValidation, useForm } from "@raycast/utils";
import { addTracking } from "./storage";
import { Track } from "./track";
import { randomUUID } from "node:crypto";

interface AddTrackingForm {
  name: string,
  carrier: string,
  trackingNumber: string,
}

export default function AddCommand() {

  const { handleSubmit, itemProps } = useForm<AddTrackingForm>({
    onSubmit: async (trackingForm) => {

      const track: Track = {
        id: randomUUID().toString(),
        name: trackingForm.name,
        trackingNumber: trackingForm.trackingNumber,
        carrier: trackingForm.carrier,
        packages: []
      }
      await addTracking(track)

      showToast({
        style: Toast.Style.Success,
        title: "New Delivery Added",
        message: trackingForm.name,
      });

    },
    validation: {
      name: FormValidation.Required,
      carrier: FormValidation.Required,
      trackingNumber: FormValidation.Required,
    },
  });


  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={ handleSubmit } />
        </ActionPanel>
      }
    >
      <Form.Description text="Fill in the details of the delivery you want to track." />
      <Form.TextField title="Name" placeholder="Name for the delivery" {...itemProps.name} />
      <Form.Dropdown title="Carrier"  {...itemProps.carrier}>
        {
          Array.from(providers.values()).map(provider => (<Form.Dropdown.Item key={ provider.name } value={ provider.name } title={ provider.name } />))
        }
      </Form.Dropdown>
      <Form.TextField title="Tracking number" placeholder="Tracking number from the carrier" {...itemProps.trackingNumber} />
    </Form>
  );
}
