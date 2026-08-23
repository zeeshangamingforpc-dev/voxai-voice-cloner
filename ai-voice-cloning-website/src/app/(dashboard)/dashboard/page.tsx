import { Card } from "@/components/ui/core";
import { Mic2, MessageSquare, History, Play, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { voices, generations, users } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [voicesCount] = await db
    .select({ value: count() })
    .from(voices)
    .where(eq(voices.userId, userId));
    
  const [gensCount] = await db
    .select({ value: count() })
    .from(generations)
    .where(eq(generations.userId, userId));

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const recentGens = await db.query.generations.findMany({
    where: eq(generations.userId, userId),
    limit: 5,
    orderBy: (generations, { desc }) => [desc(generations.createdAt)],
    with: {
      voice: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {session?.user?.name}</h1>
        <p className="text-zinc-400">Here&apos;s what&apos;s happening with your voices.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex items-center gap-4 border-blue-500/20 bg-blue-500/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Available Credits</p>
            <p className="text-2xl font-bold text-white">{user?.credits || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-500">
            <Mic2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Total Voices</p>
            <p className="text-2xl font-bold text-white">{voicesCount.value}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Generations</p>
            <p className="text-2xl font-bold text-white">{gensCount.value}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/voice-cloning" className="group rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:border-blue-500">
              <Plus className="mb-2 h-6 w-6 text-zinc-500 group-hover:text-blue-500" />
              <h3 className="font-medium text-white">Clone Voice</h3>
              <p className="text-sm text-zinc-500">Create a new voice model</p>
            </Link>
            <Link href="/text-to-speech" className="group rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:border-purple-500">
              <Play className="mb-2 h-6 w-6 text-zinc-500 group-hover:text-purple-500" />
              <h3 className="font-medium text-white">Generate Speech</h3>
              <p className="text-sm text-zinc-500">Convert text to audio</p>
            </Link>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Generations</h2>
            <Link href="/history" className="text-sm text-blue-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {recentGens.length === 0 ? (
              <p className="text-sm text-zinc-500">No generations yet.</p>
            ) : (
              recentGens.map((gen) => (
                <div key={gen.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{gen.text}</p>
                    <p className="text-xs text-zinc-500">{gen.voice?.name || "Unknown Voice"}</p>
                  </div>
                  <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                    <Play className="h-4 w-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
