import { redirect } from "next/navigation";

// The weekly plan now lives inline on the home page, right below the family summary.
export default function PlanPage() {
  redirect("/");
}
