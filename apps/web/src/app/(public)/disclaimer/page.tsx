import { redirect } from "next/navigation";

export default function DisclaimerRedirect() {
  redirect("/legal/disclaimer");
}
