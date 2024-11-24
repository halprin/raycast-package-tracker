import { Form, ActionPanel, Action, showToast, Toast, useNavigation } from "@raycast/api";
import carriers from "../carriers";
import { FormValidation, useForm } from "@raycast/utils";
import { Delivery } from "../delivery";
import { randomUUID } from "node:crypto";

interface AddDeliveryForm {
  name: string;
  carrier: string;
  trackingNumber: string;
}

export default function TrackNewDeliveryView({
  deliveries,
  setDeliveries,
  isLoading,
}: {
  deliveries?: Delivery[];
  setDeliveries: (value: Delivery[]) => Promise<void>;
  isLoading: boolean;
}) {
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<AddDeliveryForm>({
    onSubmit: async (deliveryForm) => {
      const delivery: Delivery = {
        id: randomUUID().toString(),
        name: deliveryForm.name,
        trackingNumber: deliveryForm.trackingNumber,
        carrier: deliveryForm.carrier,
      };
      await setDeliveries((deliveries || []).concat(delivery));

      await showToast({
        style: Toast.Style.Success,
        title: "New Delivery Added",
        message: deliveryForm.name,
      });

      pop();
    },
    validation: {
      name: FormValidation.Required,
      carrier: FormValidation.Required,
      trackingNumber: FormValidation.Required,
    },
  });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Fill in the details of the delivery you want to track." />
      <Form.TextField title="Name" placeholder="Name for the delivery" {...itemProps.name} />
      <Form.Dropdown title="Carrier" {...itemProps.carrier}>
        {Array.from(carriers.values()).map((carrier) => (
          <Form.Dropdown.Item key={carrier.id} value={carrier.id} title={carrier.name} />
        ))}
      </Form.Dropdown>
      <Form.TextField
        title="Tracking number"
        placeholder="Tracking number from the carrier"
        {...itemProps.trackingNumber}
      />
    </Form>
  );
}
