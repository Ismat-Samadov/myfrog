// src/app/projects/[projectId]/ProjectDetailsView.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Task, Project } from '@prisma/client';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { toast } from 'react-hot-toast';
import { logClientActivity } from '@/lib/logging';

interface ProjectDetailsViewProps {
  project: Project & { 
    tasks: Task[]; 
    _count: { tasks: number }; 
  };
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
  };
}

export default function ProjectDetailsView({ project: initialProject }: ProjectDetailsViewProps) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskAdded = () => {
    setShowTaskForm(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Task added successfully!');
  };

  return (
    <div className="min-h-screen bg-[#1a1f25] p-4">
      <div className="max-w-6xl mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>
          
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>

        <div className="bg-[#2f3641] rounded-xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
          {project.description && (
            <p className="text-gray-400">{project.description}</p>
          )}
        </div>

        <TaskList 
          projectId={project.id}
          refreshTrigger={refreshTrigger}
        />

        {showTaskForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-[#2f3641] rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Add New Task</h2>
                <button onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TaskForm projectId={project.id} onTaskAdded={handleTaskAdded} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
