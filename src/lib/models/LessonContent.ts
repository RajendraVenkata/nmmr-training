import mongoose, { Schema, type Document } from "mongoose";
import {
  QuizDataSchema,
  type IQuizData,
} from "./QuizSchema";

export interface IInlineImage {
  id: string;
  base64: string;
  mimeType: string;
  altText: string;
}

export interface IImageData {
  base64: string;
  mimeType: string;
  altText: string;
  caption: string;
}

export interface ILessonContent extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  type: "markdown" | "document" | "quiz" | "image";
  markdownContent?: string;
  quizData?: IQuizData;
  imageData?: IImageData;
  inlineImages: IInlineImage[];
  version: number;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InlineImageSchema = new Schema<IInlineImage>(
  {
    id: { type: String, required: true },
    base64: { type: String, required: true },
    mimeType: { type: String, required: true },
    altText: { type: String, default: "" },
  },
  { _id: false }
);

const ImageDataSchema = new Schema<IImageData>(
  {
    base64: { type: String, required: true },
    mimeType: { type: String, required: true },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
  },
  { _id: false }
);

const LessonContentSchema = new Schema<ILessonContent>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["markdown", "document", "quiz", "image"],
      required: true,
    },
    markdownContent: { type: String },
    quizData: { type: QuizDataSchema },
    imageData: { type: ImageDataSchema },
    inlineImages: [InlineImageSchema],
    version: { type: Number, default: 1 },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

LessonContentSchema.index({ courseId: 1, lessonId: 1 }, { unique: true });
LessonContentSchema.index({ courseId: 1 });

export const LessonContent =
  mongoose.models.LessonContent ||
  mongoose.model<ILessonContent>("LessonContent", LessonContentSchema);
