"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Input, Textarea } from "@/components/ui/core";
import { Play, Download, Loader2, AlertCircle, Music, MessageSquare } from "lucide-react";
import axios from "axios";

export default function TextToSpeechPage() {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);

  useEffect(() => {
    async function fetchVoices() {
      try {
        const response = await axios.get("/api/voices");
        setVoices(response.data);
        if (response.data.length > 0) {
          setSelectedVoice(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch voices");
      } finally {
        setIsLoadingVoices(false);
      }
    }
    fetchVoices();
  }, []);

  const handleGenerate = async () => {
    if (!text || !selectedVoice) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("/api/tts", {
        text,
        voiceId: selectedVoice,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate speech");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    let url = result.audioUrl;
    
    if (!url) {
      const blob = new Blob([Uint8Array.from(atob(result.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      url = URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = `generation-${result.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (!result.audioUrl) URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Text to Speech</h1>
        <p className="text-zinc-400">Convert your text into high-quality AI speech.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Select Voice</label>
              {isLoadingVoices ? (
                <div className="flex h-10 w-full items-center justify-center rounded-md border border-zinc-800 bg-zinc-950">
                   <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                </div>
              ) : voices.length === 0 ? (
                <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-500">
                  No voices found. Please <a href="/voice-cloning" className="text-blue-500 hover:underline">create one</a> first.
                </div>
              ) : (
                <select
                  className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Text</label>
                <span className="text-xs text-zinc-500">{text.length} characters</span>
              </div>
              <Textarea
                placeholder="Enter your text here..."
                className="min-h-[300px] resize-none text-lg leading-relaxed"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <Button
              className="w-full h-12 text-lg"
              disabled={!text || !selectedVoice || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Generate Speech
                </>
              )}
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Preview</h2>
              
              {!result && !isGenerating && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-700">
                    <Music className="h-8 w-8" />
                  </div>
                  <p className="text-sm text-zinc-500">
                    Generate speech to hear the preview.
                  </p>
                </div>
              )}

              {isGenerating && (
                 <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-sm text-zinc-500">Processing audio...</p>
                 </div>
              )}

              {result && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-zinc-950 p-6 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                          <Play className="h-5 w-5 text-white" />
                       </div>
                       <div>
                          <p className="text-sm font-medium text-white">Generated Audio</p>
                          <p className="text-xs text-zinc-500">MP3 • Ready to play</p>
                       </div>
                    </div>
                    
                    <audio 
                      controls 
                      className="w-full"
                      src={result.audioUrl || `data:audio/mpeg;base64,${result.audioContent}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Audio
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-800">
               <div className="flex gap-2 items-center text-xs text-zinc-500">
                  <MessageSquare className="h-3 w-3" />
                  <span>Tips: Break long sentences with commas for better pacing.</span>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
