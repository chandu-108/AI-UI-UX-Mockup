"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { suggestions } from '@/data/constants';
import axios from 'axios';

export function Hero() {
  const [prompt, setPrompt] = useState('');
  const [device, setDevice] = useState<string>('website');
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to create a project');
      return;
    }

    setLoading(true);
    const projectId = uuidv4();

    try {
      await axios.post('/api/project', {
        projectId,
        userInput: prompt,
        device,
        userId: user?.primaryEmailAddress?.emailAddress,
      });

      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
      setLoading(false);
    }
  };

  const handleSuggestionClick = (description: string) => {
    setPrompt(description);
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-slate-950 pt-32 pb-20">
      {/* Premium Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-violet-600/30 blur-[140px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/25 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] h-[700px] w-[700px] rounded-full bg-cyan-600/20 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-sky-600/20 blur-[100px] animate-pulse" />
      </div>
      
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h1 className="mb-8 text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">UI/UX Mockups</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-400 font-medium">
            Transform your ideas into stunning designs instantly. 
            Professional website and mobile mockups with ready-to-use HTML/Tailwind CSS code.
          </p>
        </div>

        <div className="relative group mx-auto max-w-3xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-2 backdrop-blur-2xl">
            <div className="flex flex-col gap-4 p-4">
              <Textarea
                placeholder="Describe your dream UI... e.g., 'A modern fitness tracking app with dark theme, workout plans, and progress charts'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none border-0 bg-transparent text-white placeholder:text-slate-500 focus-visible:ring-0"
              />
              
              <div className="flex items-center justify-between gap-4">
                <Select value={device} onValueChange={setDevice}>
                  <SelectTrigger className="w-[180px] border-white/10 bg-slate-800/50 text-white">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 text-white hover:from-violet-600 hover:to-fuchsia-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Quick Start Suggestions
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.description)}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-violet-500/50 hover:bg-slate-800/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 transition-transform group-hover:scale-110 group-hover:bg-violet-500/10">
                  <span className="text-2xl">{suggestion.icon}</span>
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">
                  {suggestion.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
