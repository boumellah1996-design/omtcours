import { LearnHome } from "@/components/learn-player";
import { SiteFrame } from "@/components/site-frame";

export const metadata = { title: "دوراتي" };

export default function LearnPage() {
  return (
    <SiteFrame>
      <LearnHome />
    </SiteFrame>
  );
}
