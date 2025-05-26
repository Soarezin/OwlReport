import DashBoard from '../components/dashboard/DashBoard';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  countOpenReports?: number;
  stage?: number;
  type?: string;
  icon?: React.ReactElement;
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  return (
    <DashBoard
      selectedProject={selectedProject}
      onSelectProject={setSelectedProject} projectsList={[]}    />
  );
}
