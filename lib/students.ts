import { isCourseSlug, type CourseSlug } from "@/lib/courses";
import { prisma } from "@/lib/db";
import { ensureLoginCode } from "@/lib/enrollments";

export type RegisteredStudent = {
  id: string;
  name: string;
  phone: string;
  email: string;
  loginCode: string;
  courses: CourseSlug[];
  createdAt: string;
};

export async function listRegisteredStudents(): Promise<RegisteredStudent[]> {
  const rows = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      loginCode: true,
      createdAt: true,
      enrollments: { select: { courseSlug: true, status: true } },
    },
  });

  const students: RegisteredStudent[] = [];
  for (const row of rows) {
    const courses = [
      ...new Set(
        row.enrollments
          .filter((item) => item.status === "active" && isCourseSlug(item.courseSlug))
          .map((item) => item.courseSlug),
      ),
    ];
    const email = row.email.endsWith("@students.omt.local") ? "" : row.email;
    const loginCode = courses.length > 0 ? await ensureLoginCode(row.id, row.loginCode) : row.loginCode;
    students.push({
      id: row.id,
      name: row.name,
      phone: row.phone ?? "",
      email,
      loginCode,
      courses,
      createdAt: row.createdAt.toISOString(),
    });
  }
  return students;
}
