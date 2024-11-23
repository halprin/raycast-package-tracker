import { Form, ActionPanel, Action, showToast, Toast, useNavigation } from "@raycast/api";
import providers from "../providers";
import { FormValidation, useForm } from "@raycast/utils";
import { Delivery } from "../delivery";
import { PackageMap } from "../package";

interface EditDeliveryForm {
  name: string;
  carrier: string;
  trackingNumber: string;
}

export default function EditDeliveryView({
  delivery,
  deliveries,
  setDeliveries,
  isLoading,
  setPackages,
}: {
  delivery: Delivery;
  deliveries: Delivery[];
  setDeliveries: (value: Delivery[]) => Promise<void>;
  isLoading: boolean;
  setPackages: (value: ((prevState: PackageMap) => PackageMap) | PackageMap) => void;
}) {
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<EditDeliveryForm>({
    onSubmit: async (deliveryForm) => {
      if (delivery.trackingNumber !== deliveryForm.trackingNumber || delivery.carrier !== deliveryForm.carrier) {
        // clear packages for this delivery so it will refresh
        setPackages((packages) => {
          delete packages[delivery.id];
          return packages;
        });
      }

      delivery.name = deliveryForm.name;
      delivery.trackingNumber = deliveryForm.trackingNumber;
      delivery.carrier = deliveryForm.carrier;

      await setDeliveries(deliveries);

      await showToast({
        style: Toast.Style.Success,
        title: "Delivery Modified",
        message: deliveryForm.name,
      });

      pop();
    },
    initialValues: {
      name: delivery.name,
      carrier: delivery.carrier,
      trackingNumber: delivery.trackingNumber,
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
      <Form.Description text="Edit the details of the delivery." />
      <Form.TextField
        title="Name"
        placeholder="Name for the delivery"
        {...itemProps.name}
      />
      <Form.Dropdown title="Carrier" {...itemProps.carrier}>
        {Array.from(providers.values()).map((provider) => (
          <Form.Dropdown.Item key={provider.id} value={provider.id} title={provider.name} />
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
