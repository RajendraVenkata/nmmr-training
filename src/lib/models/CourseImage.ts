import mongoose, { Schema, type Document } from "mongoose";

export interface ICourseImage extends Document {
  courseId?: mongoose.Types.ObjectId;
  purpose: "thumbnail" | "banner" | "inline" | "instructor";
  filename: string;
  mimeType: string;
  base64: string;
  width?: number;
  height?: number;
  sizeBytes: number;
  altText: string;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const CourseImageSchema = new Schema<ICourseImage>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    purpose: {
      type: String,
      enum: ["thumbnail", "banner", "inline", "instructor"],
      required: true,
    },
    filename: { type: String, required: true },
    mimeType: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => ALLOWED_MIME_TYPES.includes(v),
        message: "Invalid image type. Allowed: png, jpeg, webp, gif, svg+xml",
      },
    },
    base64: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    sizeBytes: {
      type: Number,
      required: true,
      max: [2_097_152, "Image must be 2MB or smaller"],
    },
    altText: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

CourseImageSchema.index({ courseId: 1 });
CourseImageSchema.index({ purpose: 1 });

export const CourseImage =
  mongoose.models.CourseImage ||
  mongoose.model<ICourseImage>("CourseImage", CourseImageSchema);
