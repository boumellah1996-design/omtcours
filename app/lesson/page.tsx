import { SiteFrame } from "@/components/site-frame";

const lessonEmbedUrl =
  "https://player.mediadelivery.net/embed/794046/ca2a0df9-f1c0-4732-ac80-ab861d187f15?autoplay=true&loop=false&muted=true&preload=true&responsive=true";

export const metadata = {
  title: "عنوان الدرس",
};

export default function LessonPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-4 text-2xl font-bold">عنوان الدرس</h1>
        <div className="relative overflow-hidden rounded-[20px] pt-[56.25%]">
          <iframe
            src={lessonEmbedUrl}
            title="عنوان الدرس"
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </SiteFrame>
  );
}
