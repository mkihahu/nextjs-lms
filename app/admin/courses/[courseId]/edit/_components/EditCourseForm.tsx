"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseShemaType,
  courseStatuses,
} from "@/lib/zodShema";
import { Loader2, PlusCircleIcon, SparkleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EditCourse } from "./actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface EditCourseFormProps {
  data: AdminCourseSingularType;
}

export function EditCourseForm({ data }: EditCourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Define the form using react-hook-form and zod for validation
  const form = useForm<CourseShemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      Category: data.Category as CourseShemaType["Category"],
      slug: data.slug,
      status: data.status,
      smallDescription: data.smallDescription,
    },
  });

  // Handle form submission
  function onSubmit(values: CourseShemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        EditCourse(data.id, values),
      );

      if (error) {
        toast.error("An unexpected error occured. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <form
      id="form-course"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-course-title">Course Title</FieldLabel>
              <Input
                {...field}
                id="form-course-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter course title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex gap-4 items-end">
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-course-slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="form-course-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Slug"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              const titleValue = form.getValues("title");
              const slug = slugify(titleValue);
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Generate Slug <SparkleIcon className="ml-1" size={16} />
          </Button>
        </div>
        <Controller
          name="smallDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-course-description">
                Small Description
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="form-course-smalldescription"
                  placeholder="Course small description"
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/200 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-course-description">
                Description
              </FieldLabel>
              <SimpleEditor field={field} />
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="fileKey"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-course-thumbnail">
                Thumbnail Image
              </FieldLabel>
              <Uploader onChange={field.onChange} value={field.value} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="Category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-category">Category</FieldLabel>
                <Select
                  name={field.name}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-rhf-category"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>Choose a course category</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-level">Level</FieldLabel>
                <Select
                  name={field.name}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-rhf-level"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>Choose a course level</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="duration"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-course-duration">
                  Duration (hours)
                </FieldLabel>
                <Input
                  {...field}
                  id="form-course-duration"
                  aria-invalid={fieldState.invalid}
                  placeholder="Course duration in hours"
                  autoComplete="off"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-course-price">Price ($)</FieldLabel>
                <Input
                  {...field}
                  id="form-course-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Course price in dollars"
                  autoComplete="off"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-status">Status</FieldLabel>
              <Select
                name={field.name}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-rhf-status"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {courseStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Choose a course status</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" disabled={isPending} form="form-course">
          {isPending ? (
            <>
              Updating...
              <Loader2 className="animate-spin ml-1" />
            </>
          ) : (
            <>
              Update Course <PlusCircleIcon className="ml-1" size={16} />
            </>
          )}
        </Button>
      </Field>
    </form>
  );
}
