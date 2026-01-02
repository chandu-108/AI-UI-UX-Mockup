"use client";

import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScreenFrame } from './ScreenFrame';
import { ScreenConfig } from '@/types/types';

interface CanvasProps {
  screens: ScreenConfig[];
  setScreens: React.Dispatch<React.SetStateAction<ScreenConfig[]>>;
  device: string;
  theme: string;
  projectId: string;
}

export function Canvas({ screens, setScreens, device, theme, projectId }: CanvasProps) {
  const [isPanning, setIsPanning] = useState(false);

  const screenWidth = device === 'mobile' ? 400 : 1200;
  const screenHeight = device === 'mobile' ? 800 : 800;
  const gap = 50;

  return (
    <div className="relative flex-1 overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(100, 116, 139, 0.15) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      <TransformWrapper
        initialScale={0.6}
        minScale={0.3}
        maxScale={2}
        initialPositionX={50}
        initialPositionY={50}
        wheel={{ step: 0.1 }}
        panning={{ disabled: isPanning }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
              }}
              contentStyle={{
                width: 'fit-content',
                height: 'fit-content',
              }}
            >
              <div 
                className="flex items-start gap-[50px] p-10"
                style={{ minWidth: screens.length * (screenWidth + gap) + 100 }}
              >
                {screens.map((screen, index) => (
                  <ScreenFrame
                    key={screen.screenId}
                    screen={screen}
                    index={index}
                    device={device}
                    theme={theme}
                    projectId={projectId}
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                    setScreens={setScreens}
                    onDragStart={() => setIsPanning(true)}
                    onDragStop={() => setIsPanning(false)}
                  />
                ))}
              </div>
            </TransformComponent>

            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 p-1.5 backdrop-blur-xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => zoomOut()}
                className="h-8 w-8 rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => resetTransform()}
                className="h-8 w-8 rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => zoomIn()}
                className="h-8 w-8 rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
