"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseShemaType } from "@/lib/zodShema";

export async function EditCourse(
  courseId: string,
  values: CourseShemaType,
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session?.user.id as string,
      },
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "An error occurred while updating the course",
    };
  }
}
