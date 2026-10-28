import type { CourseSlug } from "@/lib/courses";
import type { PaymentMethod } from "@/lib/payments";

export type EnrollmentStatus = "pending_payment" | "active";

export type EnrollmentRecord = {
  id: string;
  courseSlug: CourseSlug;
  name: string;
  phone: string;
  email: string;
  note: string;
  paymentMethod: PaymentMethod | "";
  receiptExt: string;
  status: EnrollmentStatus;
  createdAt: string;
  loginCode: string;
  devices: 0 | 1 | 2;
};

export type EnrollmentInput = {
  courseSlug: CourseSlug;
  name: string;
  phone: string;
  email: string;
  note: string;
  paymentMethod: PaymentMethod;
};
