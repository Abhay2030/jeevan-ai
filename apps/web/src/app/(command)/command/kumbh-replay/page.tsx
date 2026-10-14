import { redirect } from "next/navigation";

export default function LegacyReplayRedirect() {
  redirect("/command/incident-replay");
}
