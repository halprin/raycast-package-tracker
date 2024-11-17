import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import tempData from "./tempData";
import providers from "./providers";

export default function Command() {
  return (
    <List>
      {tempData.map((item, index) => (
        <List.Item
          key={item.id}
          id={item.id.toString()}
          icon={Icon.Bird}
          title={item.name}
          subtitle={item.trackingNumber}
          accessories={[
            { text: calculateDayDifference(item.deliveryDate).toString() + " days until delivery" },
            { text: { value: item.type, color: providers.get(item.type)?.color } },
          ]}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<Detail markdown={`# ${item.details}`} />} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function calculateDayDifference(deliverDate: Date): number {
  const millisecondsInDay = 1000 * 3600 * 24;

  const millisecondsDifference = deliverDate.getTime() - new Date().getTime();
  let dayDifference = Math.ceil(millisecondsDifference / millisecondsInDay);

  if (dayDifference < 0) {
    dayDifference = 0;
  }

  return dayDifference;
}
