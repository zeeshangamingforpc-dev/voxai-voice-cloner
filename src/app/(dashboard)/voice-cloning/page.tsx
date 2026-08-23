"use client";

import React, { useState } from "react";
import { Card, Button, Input, Textarea } from "@/components/ui/core";
import { Upload, X, Mic2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

export default function VoiceCloningPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    formData.append("voices", file);

    try {
      const response = await axios.post("/api/voices", formData);
      setSuccess(response.data);
      setName("");
      setDescription("");
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to clone voice");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Clone a Voice</h1>
        <p className="text-zinc-400">Upload a voice sample to create a digital twin.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Voice Sample</label>
            {!file ? (
              <div
                className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/50 p-12 transition-colors hover:bg-zinc-900/50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
                }}
              >
                <input
                  type="file"
                  accept="audio/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="mb-2 text-sm font-medium text-white">Click or drag to upload</p>
                <p className="text-xs text-zinc-500">WAV, MP3 up to 10MB (min 15s recommended)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Mic2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Voice Name</label>
            <Input
              placeholder="Enter voice name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Description (Optional)</label>
            <Textarea
              placeholder="What is this voice for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-4 text-sm text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              <span>Voice &quot;{success.name}&quot; created successfully!</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!file || !name || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your voice...
              </>
            ) : (
              "Create Voice"
            )}
          </Button>

          <p className="text-center text-xs text-zinc-500">
            By creating a voice, you confirm you have the legal right and permission to clone this voice.
          </p>
        </form>
      </Card>
    </div>
  );
}
