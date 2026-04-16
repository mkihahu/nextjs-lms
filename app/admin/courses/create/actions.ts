"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseShemaType } from "@/lib/zodShema";
import { headers } from "next/headers";

export async function CreateCourse(
  values: CourseShemaType,
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    // rate limit to 5 requests per minute
    // const rateLimit = await requireRateLimit();
    // if (!rateLimit) {
    //   return {
    //     status: "error",
    //     message: "Rate limit exceeded",
    //   };
    // }

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "An error occurred while creating the course",
    };
  }
}
