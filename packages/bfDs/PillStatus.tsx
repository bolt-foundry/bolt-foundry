import { Pill } from "packages/bfDs/Pill.tsx";

type Props = { label: string; status: string };

export function PillStatus({ label, status }: Props) {
  let statusColor = "text";
  let icon = "";
  switch (status) {
    case "NEW":
      statusColor = "text";
      break;
    case "IN_PROGRESS":
      statusColor = "primaryColor";
      break;
    case "COMPLETED":
      statusColor = "secondaryColor";
      icon = "check";
      break;
    case "ERROR":
      statusColor = "alert";
      icon = "cross";
      break;
    default:
      statusColor = "text";
  }
  return <Pill label={label} textIcon={icon} color={statusColor} />;
}
