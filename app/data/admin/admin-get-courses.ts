import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetcourses() {
  await requireAdmin();

  // Fetch courses from the database or any other source
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

export type AdminGetCourseType = Awaited<ReturnType<typeof adminGetcourses>>[0];
