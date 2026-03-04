"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Cpu,
  MemoryStick,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { LabDefinition } from "@/types";

export default function AdminLabsPage() {
  const [labs, setLabs] = useState<LabDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [labToDelete, setLabToDelete] = useState<LabDefinition | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLabs();
  }, []);

  async function fetchLabs() {
    try {
      const res = await fetch("/api/admin/labs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLabs(data.labs);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load labs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!labToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/labs/${labToDelete.labId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setLabs(labs.filter((l) => l.labId !== labToDelete.labId));
      toast({ title: "Lab deleted", description: `${labToDelete.name} has been removed.` });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete lab",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setLabToDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Environments</h1>
          <p className="text-muted-foreground">
            Manage Docker-based lab environments for interactive terminal lessons
          </p>
        </div>
        <Link href="/admin/labs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Lab
          </Button>
        </Link>
      </div>

      {labs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Terminal className="h-12 w-12 text-muted-foreground/50" />
            <div className="text-center">
              <h3 className="font-semibold">No labs configured</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first lab environment to enable interactive terminals in lessons.
              </p>
            </div>
            <Link href="/admin/labs/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Lab
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Labs</CardTitle>
            <CardDescription>{labs.length} lab environment(s) configured</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lab ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Docker Image</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labs.map((lab) => (
                  <TableRow key={lab.labId}>
                    <TableCell className="font-mono text-sm">{lab.labId}</TableCell>
                    <TableCell className="font-medium">{lab.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {lab.dockerImage}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          {lab.resources.cpuLimit} CPU
                        </span>
                        <span className="flex items-center gap-1">
                          <MemoryStick className="h-3 w-3" />
                          {lab.resources.memoryLimit}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lab.resources.timeoutMinutes}m timeout
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lab.isActive ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600/30"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-500 border-red-500/30"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/labs/${lab.labId}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 dark:text-red-400"
                          onClick={() => {
                            setLabToDelete(lab);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lab Environment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{labToDelete?.name}&quot;?
              This action cannot be undone. Any lessons using this lab will
              no longer have an active terminal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
