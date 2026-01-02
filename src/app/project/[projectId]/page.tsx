"use client";

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ProjectHeader } from './_shared/ProjectHeader';
import { SettingsSection } from './_shared/SettingsSection';
import { Canvas } from './_shared/Canvas';
import { useSetting } from '@/context/SettingContext';
import { useRefreshData } from '@/context/RefreshDataContext';
import { ProjectType, ScreenConfig } from '@/types/types';
import axios from 'axios';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { projectId } = use(params);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [screens, setScreens] = useState<ScreenConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading project details...');
  const [generatingScreens, setGeneratingScreens] = useState(false);
  const { settingDetail, setSettingDetail } = useSetting();
  const { refreshData } = useRefreshData();
  const router = useRouter();
  const hasGenerated = useRef(false);

  useEffect(() => {
    fetchProjectData();
  }, [projectId, refreshData]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get('/api/project', {
        params: { projectId }
      });

      if (response.data.error) {
        toast.error('Project not found');
        router.push('/');
        return;
      }

      const projectData = response.data;
      setProject(projectData);
      setScreens(projectData.screens || []);
      
      setSettingDetail({
        projectId: projectData.projectId,
        projectName: projectData.projectName || 'Untitled Project',
        theme: projectData.theme || 'Midnight Blue',
        device: projectData.device || 'website',
        projectVisualDescription: projectData.projectVisualDescription,
      });

      if ((!projectData.screens || projectData.screens.length === 0) && !hasGenerated.current) {
        hasGenerated.current = true;
        await generateProject(projectData);
      } else {
        const screensWithoutCode = projectData.screens?.filter((s: ScreenConfig) => !s.code) || [];
        if (screensWithoutCode.length > 0) {
          await generateScreenUIs(screensWithoutCode, projectData);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      setLoading(false);
    }
  };

  const generateProject = async (projectData: ProjectType) => {
    setLoadingMessage('Generating screen configuration...');
    setGeneratingScreens(true);
    
    try {
      const configResponse = await axios.post('/api/generate-config', {
        userInput: projectData.userInput,
        deviceType: projectData.device,
        projectId: projectData.projectId,
      });

      const config = configResponse.data;
      
      setSettingDetail({
        projectId: projectData.projectId,
        projectName: config.projectName,
        theme: config.theme,
        device: projectData.device,
        projectVisualDescription: config.projectVisualDescription,
      });

      const newScreens = config.screens.map((s: { screenId: string; name: string; purpose: string; layoutDescription: string }) => ({
        projectId: projectData.projectId,
        screenId: s.screenId,
        screenName: s.name,
        purpose: s.purpose,
        screenDescription: s.layoutDescription,
      }));
      
      setScreens(newScreens);

      for (let i = 0; i < newScreens.length; i++) {
        const screen = newScreens[i];
        setLoadingMessage(`Generating screen ${i + 1} of ${newScreens.length}: ${screen.screenName}...`);
        
        const uiResponse = await axios.post('/api/generate-screen-ui', {
          projectId: projectData.projectId,
          screenId: screen.screenId,
          screenName: screen.screenName,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
          deviceType: projectData.device,
          projectVisualDescription: config.projectVisualDescription,
        });

        setScreens(prev => prev.map(s => 
          s.screenId === screen.screenId ? { ...s, code: uiResponse.data.code } : s
        ));
      }
    } catch (error) {
      console.error('Error generating project:', error);
      toast.error('Failed to generate project');
    } finally {
      setGeneratingScreens(false);
    }
  };

  const generateScreenUIs = async (screensToGenerate: ScreenConfig[], projectData: ProjectType) => {
    setGeneratingScreens(true);
    
    for (let i = 0; i < screensToGenerate.length; i++) {
      const screen = screensToGenerate[i];
      setLoadingMessage(`Generating screen ${i + 1} of ${screensToGenerate.length}: ${screen.screenName}...`);
      
      try {
        const uiResponse = await axios.post('/api/generate-screen-ui', {
          projectId: projectData.projectId,
          screenId: screen.screenId,
          screenName: screen.screenName,
          purpose: screen.purpose,
          screenDescription: screen.screenDescription,
          deviceType: projectData.device,
          projectVisualDescription: projectData.projectVisualDescription,
        });

        setScreens(prev => prev.map(s => 
          s.screenId === screen.screenId ? { ...s, code: uiResponse.data.code } : s
        ));
      } catch (error) {
        console.error('Error generating screen UI:', error);
      }
    }
    
    setGeneratingScreens(false);
  };

  if (loading && !screens.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-950/30 px-8 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm text-blue-300">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <ProjectHeader projectId={projectId} />
      
      <div className="flex flex-1 pt-16">
        <SettingsSection 
          projectId={projectId}
          screens={screens}
          setScreens={setScreens}
        />
        
        <Canvas 
          screens={screens}
          setScreens={setScreens}
          device={settingDetail?.device || 'website'}
          theme={settingDetail?.theme || 'Midnight Blue'}
          projectId={projectId}
        />
      </div>

      {generatingScreens && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-950/90 px-6 py-3 backdrop-blur-xl">
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            <p className="text-sm text-blue-300">{loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
