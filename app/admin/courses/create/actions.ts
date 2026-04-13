"use server";

import { prisma } from "@/lib/db";
import { courseSchema, CourseShemaType } from "@/lib/zodShema";

export async function CreateCourse(values: CourseShemaType) {
  try {
    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const data = await prisma.course.create({
      data: {
        ...validation.data,
        userId: "userId",
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {}
}
