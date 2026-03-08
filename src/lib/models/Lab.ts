import mongoose, { Schema, type Document } from "mongoose";

export interface IPreloadFile {
  path: string;
  content: string;
}

export interface ILabResources {
  cpuLimit: number;
  memoryLimit: string;
  diskLimit: string;
  timeoutMinutes: number;
}

export interface ILab extends Document {
  labId: string;
  name: string;
  dockerImage: string;
  description: string;
  resources: ILabResources;
  preloadFiles: IPreloadFile[];
  startupCommand: string | null;
  networkEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PreloadFileSchema = new Schema<IPreloadFile>(
  {
    path: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const LabResourcesSchema = new Schema<ILabResources>(
  {
    cpuLimit: { type: Number, default: 0.5 },
    memoryLimit: { type: String, default: "256m" },
    diskLimit: { type: String, default: "100m" },
    timeoutMinutes: { type: Number, default: 30 },
  },
  { _id: false }
);

const LabSchema = new Schema<ILab>(
  {
    labId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dockerImage: { type: String, required: true },
    description: { type: String, default: "" },
    resources: { type: LabResourcesSchema, default: () => ({}) },
    preloadFiles: { type: [PreloadFileSchema], default: [] },
    startupCommand: { type: String, default: null },
    networkEnabled: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Lab =
  mongoose.models.Lab || mongoose.model<ILab>("Lab", LabSchema);
