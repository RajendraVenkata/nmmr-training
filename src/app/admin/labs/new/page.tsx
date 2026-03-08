"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface PreloadFile {
  path: string;
  content: string;
}

export default function NewLabPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Form state
  const [labId, setLabId] = useState("");
  const [name, setName] = useState("");
  const [dockerImage, setDockerImage] = useState("");
  const [description, setDescription] = useState("");
  const [cpuLimit, setCpuLimit] = useState("0.5");
  const [memoryLimit, setMemoryLimit] = useState("256m");
  const [diskLimit, setDiskLimit] = useState("100m");
  const [timeoutMinutes, setTimeoutMinutes] = useState("30");
  const [networkEnabled, setNetworkEnabled] = useState(false);
  const [preloadFiles, setPreloadFiles] = useState<PreloadFile[]>([]);

  function addPreloadFile() {
    setPreloadFiles([...preloadFiles, { path: "", content: "" }]);
  }

  function removePreloadFile(index: number) {
    setPreloadFiles(preloadFiles.filter((_, i) => i !== index));
  }

  function updatePreloadFile(index: number, field: "path" | "content", value: string) {
    const updated = [...preloadFiles];
    updated[index][field] = value;
    setPreloadFiles(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!labId || !name || !dockerImage) {
      toast({
        title: "Validation Error",
        description: "Lab ID, Name, and Docker Image are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId,
          name,
          dockerImage,
          description,
          resources: {
            cpuLimit: parseFloat(cpuLimit),
            memoryLimit,
            diskLimit,
            timeoutMinutes: parseInt(timeoutMinutes, 10),
          },
          networkEnabled,
          preloadFiles: preloadFiles.filter((f) => f.path && f.content),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create lab");
      }

      toast({ title: "Lab created", description: `${name} has been created successfully.` });
      router.push("/admin/labs");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create lab",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/labs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Lab Environment</h1>
          <p className="text-muted-foreground">
            Configure a new Docker-based lab for interactive terminal lessons
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="labId">Lab ID (slug)</Label>
                <Input
                  id="labId"
                  value={labId}
                  onChange={(e) => setLabId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="python-basics"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier. Lowercase letters, numbers, and hyphens only.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Python Basics Lab"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dockerImage">Docker Image</Label>
              <Input
                id="dockerImage"
                value={dockerImage}
                onChange={(e) => setDockerImage(e.target.value)}
                placeholder="nmmr/python-lab:latest"
                required
              />
              <p className="text-xs text-muted-foreground">
                The Docker image must be pre-built on the terminal server.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Python 3.12 with common packages (numpy, pandas, requests, etc.)"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resource Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Limits</CardTitle>
            <CardDescription>
              Set CPU, memory, and timeout limits per container
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpuLimit">CPU Cores</Label>
                <Select value={cpuLimit} onValueChange={setCpuLimit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">0.25</SelectItem>
                    <SelectItem value="0.5">0.5</SelectItem>
                    <SelectItem value="1">1.0</SelectItem>
                    <SelectItem value="2">2.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memoryLimit">Memory</Label>
                <Select value={memoryLimit} onValueChange={setMemoryLimit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128m">128 MB</SelectItem>
                    <SelectItem value="256m">256 MB</SelectItem>
                    <SelectItem value="512m">512 MB</SelectItem>
                    <SelectItem value="1g">1 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diskLimit">Disk</Label>
                <Select value={diskLimit} onValueChange={setDiskLimit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50m">50 MB</SelectItem>
                    <SelectItem value="100m">100 MB</SelectItem>
                    <SelectItem value="256m">256 MB</SelectItem>
                    <SelectItem value="500m">500 MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (min)</Label>
                <Select value={timeoutMinutes} onValueChange={setTimeoutMinutes}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="networkEnabled"
                checked={networkEnabled}
                onChange={(e) => setNetworkEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="networkEnabled" className="cursor-pointer">
                Enable network access (allows containers to reach the internet)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Preloaded Files */}
        <Card>
          <CardHeader>
            <CardTitle>Preloaded Files</CardTitle>
            <CardDescription>
              Files to create inside the container when it starts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preloadFiles.map((file, index) => (
              <div key={index} className="border rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>File {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600"
                    onClick={() => removePreloadFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Path</Label>
                  <Input
                    value={file.path}
                    onChange={(e) => updatePreloadFile(index, "path", e.target.value)}
                    placeholder="/home/learner/hello.py"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={file.content}
                    onChange={(e) => updatePreloadFile(index, "content", e.target.value)}
                    placeholder='print("Hello World!")'
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPreloadFile}>
              <Plus className="h-4 w-4 mr-2" />
              Add File
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/labs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Create Lab
          </Button>
        </div>
      </form>
    </div>
  );
}
