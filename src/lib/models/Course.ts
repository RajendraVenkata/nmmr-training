import mongoose, { Schema, type Document } from "mongoose";

export interface ILesson {
  title: string;
  type: "markdown" | "document" | "quiz" | "image";
  content: string;
  contentRef?: mongoose.Types.ObjectId;
  duration: string;
  order: number;
  isFree: boolean;
}

export interface IModule {
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  thumbnailRef?: mongoose.Types.ObjectId;
  price: number;
  currency: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  status: "draft" | "published" | "archived";
  instructor: string;
  order: number;
  courseNumber: string;
  tags: string[];
  prerequisites: string[];
  modules: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["markdown", "document", "quiz", "image"],
      required: true,
    },
    content: { type: String, default: "", maxlength: 500 },
    contentRef: {
      type: Schema.Types.ObjectId,
      ref: "LessonContent",
    },
    duration: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
  },
  { _id: true }
);

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lessons: [LessonSchema],
  },
  { _id: true }
);

const CourseSchema = new Schema<ICourse>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    thumbnail: { type: String, default: "/images/placeholder-course.webp" },
    thumbnailRef: {
      type: Schema.Types.ObjectId,
      ref: "CourseImage",
    },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    instructor: { type: String, default: "" },
    order: { type: Number, default: 0 },
    courseNumber: { type: String, default: "" },
    tags: [{ type: String }],
    prerequisites: [{ type: String }],
    modules: [ModuleSchema],
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
