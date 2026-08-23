"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "@/components/ui/core";
import { History, Play, Download, Trash2, Loader2, Calendar, FileText } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";

export default function HistoryPage() {
  const [generations, setGenerations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await axios.get("/api/generations");
      setGenerations(response.data);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this generation?")) return;
    setIsDeleting(id);
    try {
      await axios.delete(`/api/generations?id=${id}`);
      setGenerations(generations.filter(g => g.id !== id));
    } catch (err) {
      console.error("Failed to delete generation");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDownload = async (gen: any) => {
    let url = gen.audioUrl;
    
    if (!url) {
      const blob = new Blob([Uint8Array.from(atob(gen.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      url = URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = `generation-${gen.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!gen.audioUrl) URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Generation History</h1>
        <p className="text-zinc-400">Review and download your previous generations.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : generations.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-20 text-center">
          <History className="mx-auto mb-4 h-12 w-12 text-zinc-700" />
          <h3 className="text-lg font-medium text-white">No history yet</h3>
          <p className="mb-6 text-zinc-500">Your generated audio will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <Card key={gen.id} className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(gen.createdAt), "MMM d, yyyy HH:mm")}
                  <span className="mx-2 text-zinc-800">•</span>
                  <div className="flex items-center gap-1">
                     <div className="h-2 w-2 rounded-full bg-blue-500" />
                     {gen.voice?.name || "Deleted Voice"}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-4 w-4 shrink-0 text-zinc-600" />
                  <p className="line-clamp-2 text-sm text-zinc-300">{gen.text}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="w-full lg:w-64">
                   <audio 
                      controls 
                      className="h-8 w-full"
                      src={gen.audioUrl || `data:audio/mpeg;base64,${gen.audioContent}`}
                    />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(gen)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-500"
                    onClick={() => handleDelete(gen.id)}
                    disabled={isDeleting === gen.id}
                  >
                    {isDeleting === gen.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Add size prop to Button in core.tsx
