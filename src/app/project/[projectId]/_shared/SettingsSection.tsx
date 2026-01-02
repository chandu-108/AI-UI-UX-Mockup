"use client";

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSetting } from '@/context/SettingContext';
import { themes, themeList } from '@/data/themes';
import { ScreenConfig } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast } from 'sonner';

interface SettingsSectionProps {
  projectId: string;
  screens: ScreenConfig[];
  setScreens: React.Dispatch<React.SetStateAction<ScreenConfig[]>>;
}

export function SettingsSection({ projectId, screens, setScreens }: SettingsSectionProps) {
  const [newScreenPrompt, setNewScreenPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const { settingDetail, setSettingDetail } = useSetting();

  const handleThemeChange = (themeName: string) => {
    if (settingDetail) {
      setSettingDetail({ ...settingDetail, theme: themeName });
    }
  };

  const handleGenerateNewScreen = async () => {
    if (!newScreenPrompt.trim()) {
      toast.error('Please enter a screen description');
      return;
    }

    setGenerating(true);
    try {
      const screenId = uuidv4();
      const screenName = newScreenPrompt.slice(0, 30);

      const newScreen: ScreenConfig = {
        projectId,
        screenId,
        screenName,
        purpose: newScreenPrompt,
        screenDescription: newScreenPrompt,
      };

      setScreens(prev => [...prev, newScreen]);

      const response = await axios.post('/api/generate-screen-ui', {
        projectId,
        screenId,
        screenName,
        purpose: newScreenPrompt,
        screenDescription: newScreenPrompt,
        deviceType: settingDetail?.device || 'website',
        projectVisualDescription: settingDetail?.projectVisualDescription,
      });

      setScreens(prev => prev.map(s =>
        s.screenId === screenId ? { ...s, code: response.data.code } : s
      ));

      setNewScreenPrompt('');
      toast.success('New screen generated successfully');
    } catch (error) {
      console.error('Error generating new screen:', error);
      toast.error('Failed to generate new screen');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <aside className="w-[300px] flex-shrink-0 border-r border-white/10 bg-slate-900/50">
      <div className="flex h-full flex-col p-4">
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-slate-400">Generate New Screen</h3>
          <Textarea
            placeholder="Describe the screen you want to add..."
            value={newScreenPrompt}
            onChange={(e) => setNewScreenPrompt(e.target.value)}
            className="mb-3 min-h-[100px] resize-none border-white/10 bg-slate-800/50 text-white placeholder:text-slate-500"
          />
          <Button
            onClick={handleGenerateNewScreen}
            disabled={generating}
            className="w-full gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
        </div>

        <div className="flex-1">
          <h3 className="mb-3 text-sm font-medium text-slate-400">Themes</h3>
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-2 pr-4">
              {themeList.map((themeName) => {
                const theme = themes[themeName];
                const isSelected = settingDetail?.theme === themeName;
                
                return (
                  <button
                    key={themeName}
                    onClick={() => handleThemeChange(themeName)}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 transition-all ${
                      isSelected 
                        ? 'border border-violet-500 bg-violet-500/10' 
                        : 'border border-transparent bg-slate-800/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex gap-1">
                      <div 
                        className="h-6 w-6 rounded-full border border-white/20" 
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="h-6 w-6 rounded-full border border-white/20" 
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div 
                        className="h-6 w-6 rounded-full border border-white/20" 
                        style={{ backgroundColor: theme.accent }}
                      />
                      <div 
                        className="h-6 w-6 rounded-full border border-white/20" 
                        style={{ backgroundColor: theme.background }}
                      />
                    </div>
                    <span className="text-sm text-white">{themeName}</span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs text-slate-500">
            {screens.length} screen{screens.length !== 1 ? 's' : ''} in project
          </p>
        </div>
      </div>
    </aside>
  );
}
