"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui/core";
import { Search, Mic2, Play, Trash2, Loader2, Plus, Calendar } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";

export default function VoicesPage() {
  const [voices, setVoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  async function fetchVoices() {
    try {
      const response = await axios.get("/api/voices");
      setVoices(response.data);
    } catch (err) {
      console.error("Failed to fetch voices");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voice?")) return;
    setIsDeleting(id);
    try {
      await axios.delete(`/api/voices?id=${id}`);
      setVoices(voices.filter(v => v.id !== id));
    } catch (err) {
      console.error("Failed to delete voice");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredVoices = voices.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Voice Library</h1>
          <p className="text-zinc-400">Manage your custom voice models.</p>
        </div>
        <Link href="/voice-cloning">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Voice
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search voices..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredVoices.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-20 text-center">
          <Mic2 className="mx-auto mb-4 h-12 w-12 text-zinc-700" />
          <h3 className="text-lg font-medium text-white">No voices found</h3>
          <p className="mb-6 text-zinc-500">You haven&apos;t created any voices yet.</p>
          <Link href="/voice-cloning">
            <Button variant="outline">Create your first voice</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVoices.map((voice) => (
            <Card key={voice.id} className="group relative flex flex-col justify-between">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Mic2 className="h-6 w-6" />
                </div>
                <button
                  onClick={() => handleDelete(voice.id)}
                  disabled={isDeleting === voice.id}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                >
                  {isDeleting === voice.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-1 text-lg font-bold text-white">{voice.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-zinc-500">
                  {voice.description || "No description provided."}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-600">
                   <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(voice.createdAt), "MMM d, yyyy")}
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="font-mono">{voice.fishVoiceId.slice(0, 8)}...</span>
                   </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/text-to-speech" className="flex-1">
                  <Button variant="primary" className="w-full">
                    Use Voice
                  </Button>
                </Link>
                <Button variant="outline" className="px-3">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
