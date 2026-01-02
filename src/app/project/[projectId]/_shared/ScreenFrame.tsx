"use client";

import { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { GripVertical, Code, Download, Sparkles, Trash2, MoreVertical, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import html2canvas from 'html2canvas';
import { ScreenConfig } from '@/types/types';
import { themes, getThemeCSSVariables } from '@/data/themes';
import { useRefreshData } from '@/context/RefreshDataContext';
import axios from 'axios';
import { toast } from 'sonner';

interface ScreenFrameProps {
  screen: ScreenConfig;
  index: number;
  device: string;
  theme: string;
  projectId: string;
  screenWidth: number;
  screenHeight: number;
  setScreens: React.Dispatch<React.SetStateAction<ScreenConfig[]>>;
  onDragStart: () => void;
  onDragStop: () => void;
}

export function ScreenFrame({
  screen,
  index,
  device,
  theme,
  projectId,
  screenWidth,
  screenHeight,
  setScreens,
  onDragStart,
  onDragStop,
}: ScreenFrameProps) {
  const [showCode, setShowCode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setRefreshData } = useRefreshData();

  const getFullHtml = () => {
    const themeVars = getThemeCSSVariables(theme);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      ${themeVars}
    }
    body {
      font-family: 'DM Sans', sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--background);
      color: var(--foreground);
    }
  </style>
</head>
<body>
  ${screen.code || '<div class="flex items-center justify-center h-screen bg-slate-900 text-slate-400">Generating...</div>'}
</body>
</html>`;
  };

  const handleDownload = async () => {
    if (!iframeRef.current?.contentDocument?.body) {
      toast.error('Unable to capture screenshot');
      return;
    }

    try {
      const canvas = await html2canvas(iframeRef.current.contentDocument.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: themes[theme]?.background || '#000',
      });
      
      const link = document.createElement('a');
      link.download = `${screen.screenName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Screenshot downloaded');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getFullHtml());
    toast.success('Code copied to clipboard');
  };

  const handleEdit = async () => {
    if (!editPrompt.trim()) {
      toast.error('Please enter your changes');
      return;
    }

    setEditing(true);
    try {
      const response = await axios.post('/api/edit-screen', {
        projectId,
        screenId: screen.screenId,
        userInput: editPrompt,
        currentCode: screen.code,
      });

      setScreens(prev => prev.map(s =>
        s.screenId === screen.screenId ? { ...s, code: response.data.code } : s
      ));

      setEditPrompt('');
      toast.success('Screen updated successfully');
    } catch (error) {
      console.error('Error editing screen:', error);
      toast.error('Failed to edit screen');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/generate-config?projectId=${projectId}&screenId=${screen.screenId}`);
      
      setScreens(prev => prev.filter(s => s.screenId !== screen.screenId));
      setRefreshData({ method: 'delete', timestamp: Date.now() });
      toast.success('Screen deleted');
    } catch (error) {
      console.error('Error deleting screen:', error);
      toast.error('Failed to delete screen');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: screenWidth,
          height: screenHeight + 40,
        }}
        minWidth={300}
        minHeight={400}
        enableResizing={{
          bottomLeft: true,
          bottomRight: true,
        }}
        disableDragging={false}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        dragHandleClassName="drag-handle"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-800/50 shadow-2xl">
          <div className="drag-handle flex items-center justify-between border-b border-white/10 bg-slate-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 cursor-grab text-slate-500" />
              <span className="text-sm font-medium text-white">{screen.screenName}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCode(true)}
                className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Code className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 border-white/10 bg-slate-900 p-4">
                  <h4 className="mb-3 text-sm font-medium text-white">Edit Screen</h4>
                  <Textarea
                    placeholder="Describe what changes you want..."
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="mb-3 min-h-[80px] border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                  />
                  <Button
                    onClick={handleEdit}
                    disabled={editing}
                    className="w-full gap-2 bg-violet-600 text-white hover:bg-violet-700"
                  >
                    {editing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Apply Changes
                      </>
                    )}
                  </Button>
                </PopoverContent>
              </Popover>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-white/10 bg-slate-900">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
                  >
                    {deleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Screen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <iframe
              ref={iframeRef}
              srcDoc={getFullHtml()}
              className="h-full w-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </Rnd>

      <Dialog open={showCode} onOpenChange={setShowCode}>
        <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden border-white/10 bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-white">
              <span>{screen.screenName} - Code</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="gap-2 text-slate-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto rounded-lg">
            <SyntaxHighlighter
              language="html"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '13px',
              }}
              wrapLongLines
            >
              {getFullHtml()}
            </SyntaxHighlighter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
