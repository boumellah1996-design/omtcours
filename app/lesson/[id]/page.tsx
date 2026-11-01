import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BunnyPlayer } from "@/components/BunnyPlayer";
import { SiteFrame } from "@/components/site-frame";
import { currentUser } from "@/lib/access";
import { isBunnyEmbed, signBunnyEmbed } from "@/lib/bunny";
import { courseTitlesAr, isCourseSlug } from "@/lib/courses";
import { ensureDatabase, prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await ensureDatabase();
    const lesson = await prisma.lesson.findUnique({ where: { id }, select: { title: true } });
    return { title: lesson?.title ?? "الدرس" };
  } catch {
    return { title: "الدرس" };
  }
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/login?next=/lesson/${id}`);

  await ensureDatabase();
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson || !isCourseSlug(lesson.courseSlug)) notFound();

  if (user.role !== "admin") {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseSlug: lesson.courseSlug, status: "active" },
    });
    if (!enrollment) redirect(`/learn/${lesson.courseSlug}`);
  }

  const signed = signBunnyEmbed(lesson.bunnyVideoId);
  const embedUrl = signed && isBunnyEmbed(signed.url) ? signed.url : "";

  return (
    <SiteFrame>
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <Link href={`/learn/${lesson.courseSlug}`} className="text-sm font-extrabold underline-offset-4 hover:underline">
          ← {courseTitlesAr[lesson.courseSlug]}
        </Link>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>

        <BunnyPlayer videoId={lesson.bunnyVideoId} embedUrl={embedUrl} title={lesson.title} />

        <div className="rounded-lg bg-[#1c2128] p-4 text-white">
          <h2 className="mb-2 text-lg font-semibold">وصف الدرس</h2>
          <p>
            {String(lesson.position).padStart(2, "0")}. {lesson.title} — {courseTitlesAr[lesson.courseSlug]}
          </p>
        </div>
      </div>
    </SiteFrame>
  );
}
