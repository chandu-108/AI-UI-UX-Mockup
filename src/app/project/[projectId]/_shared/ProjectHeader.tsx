"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSetting } from '@/context/SettingContext';
import axios from 'axios';
import { toast } from 'sonner';

interface ProjectHeaderProps {
  projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const [saving, setSaving] = useState(false);
  const { settingDetail, setSettingDetail } = useSetting();

  const handleSave = async () => {
    if (!settingDetail) return;
    
    setSaving(true);
    try {
      await axios.put('/api/project', {
        projectId,
        projectName: settingDetail.projectName,
        theme: settingDetail.theme,
      });
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </Link>
          
          <div className="h-6 w-px bg-white/10" />
          
          <Input
            value={settingDetail?.projectName || ''}
            onChange={(e) => setSettingDetail(settingDetail ? { ...settingDetail, projectName: e.target.value } : null)}
            className="h-8 w-64 border-transparent bg-transparent text-white placeholder:text-slate-500 focus:border-violet-500/50 focus:bg-slate-800/50"
            placeholder="Project name"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
