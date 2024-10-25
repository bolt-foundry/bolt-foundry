import { Pill } from "packages/bfDs/Pill.tsx";
import type { BfDsIconType } from "packages/bfDs/BfDsIcon.tsx";

type Props = { label: string; status: string; percent?: number };

export function PillStatus({ label, status, percent }: Props) {
  let statusColor = "textSecondary";
  let icon = undefined;
  let text = undefined;
  switch (status) {
    case "NEW":
    case "EXTRACTING_AUDIO":
      statusColor = "textSecondary";
      text = "--";
      break;
    case "IN_PROGRESS":
    case "PROCESSING":
    case "TRANSCRIBING":
      statusColor = "text";
      text = percent ? `${percent * 100}%` : "--";
      break;
    case "COMPLETED":
      statusColor = "secondaryColor";
      icon = "check";
      text = undefined;
      break;
    case "ERROR":
    case "FAILED":
      statusColor = "alert";
      icon = "cross";
      break;
    default:
      statusColor = "text";
  }
  return (
    <Pill
      label={label}
      text={text}
      icon={icon as BfDsIconType}
      color={statusColor}
    />
  );
}
