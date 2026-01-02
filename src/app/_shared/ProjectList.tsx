"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Folder, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRefreshData } from '@/context/RefreshDataContext';
import { ProjectType } from '@/types/types';
import axios from 'axios';

export function ProjectList() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useUser();
  const { refreshData } = useRefreshData();

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, user, refreshData]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/project', {
        params: { userId: user?.primaryEmailAddress?.emailAddress }
      });
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Projects</h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-slate-900/30 p-4">
                <Skeleton className="mb-4 h-48 w-full rounded-lg bg-slate-800" />
                <Skeleton className="mb-2 h-5 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-1/2 bg-slate-800" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 py-20">
            <Folder className="mb-4 h-12 w-12 text-slate-600" />
            <p className="text-lg font-medium text-slate-400">No projects yet</p>
            <p className="text-sm text-slate-500">Create your first mockup using the form above</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.projectId}
                href={`/project/${project.projectId}`}
                className="group overflow-hidden rounded-xl border border-white/5 bg-slate-900/30 transition-all hover:border-violet-500/30 hover:bg-slate-800/50"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-800">
                  {project.screenshot ? (
                    <Image
                      src={project.screenshot}
                      alt={project.projectName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                        <Folder className="h-8 w-8 text-violet-400" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-white group-hover:text-violet-400">
                    {project.projectName || 'Untitled Project'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {project.createdOn
                        ? format(new Date(project.createdOn), 'MMM d, yyyy')
                        : 'No date'}
                    </span>
                    <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs capitalize">
                      {project.device}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
