import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { useState, useEffect } from "react";


interface Project {
  id: string;
  name: string;
  stage: number;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    projectRoles: { projectId: string; roleId: string }[];
  }) => void;
  projects: Project[];
  roles: { value: string; label: string }[];
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    projectRoles: { projectId: string; roleId: string }[];
  }) => void;
  projects: Project[];
  roles: { value: string; label: string }[];
  initialData?: {
    name: string;
    email: string;
    projects: { projectId: string; roleId: string }[];
  };
}

export default function AddUserModal({ open, onClose, onSubmit, projects, roles, initialData }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setEmail(initialData.email);

      const map: Record<string, string> = {};
      initialData.projects.forEach(p => {
        map[p.projectId] = p.roleId;
      });
      setSelectedProjects(map);
    }

    if (open && !initialData) {
      setName("");
      setEmail("");
      setSelectedProjects({});
    }
  }, [open, initialData]);

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSelection = { ...prev };
      if (newSelection[projectId]) {
        delete newSelection[projectId];
      } else {
        newSelection[projectId] = roles[0]?.value || "";
      }
      return newSelection;
    });
  };

  const groupedProjects = projects.reduce((acc, project) => {
    const stageLabel = getStageLabel(project.stage);
    if (!acc[stageLabel]) acc[stageLabel] = [];
    acc[stageLabel].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  function getStageLabel(stage: number): string {
    switch (stage) {
      case 1: return "Desenvolvimento";
      case 2: return "Teste";
      case 3: return "Homologação";
      case 4: return "Produção";
      default: return "Outro";
    }
  }

  const handleRoleChange = (projectId: string, role: string) => {
    setSelectedProjects(prev => ({ ...prev, [projectId]: role }));
  };


  const handleSubmit = () => {
    const formattedProjects = Object.entries(selectedProjects).map(([projectId, role]) => ({
      projectId,
      role
    }));
    onSubmit({
      name,
      email,
      projectRoles: formattedProjects.map(p => ({
        projectId: p.projectId,
        roleId: p.role
      }))
    });
    setName("");
    setEmail("");
    setSelectedProjects({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{
      sx: {
        backgroundColor: '#111C2D',
        borderRadius: 2,
        color: '#F1F5F9',
        backgroundImage: 'none'
      }
    }}>

      <DialogTitle sx={{ color: '#white', fontWeight: 'bold', fontVariant: 'h5' }}>Adicionar Novo Membro</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ input: { color: '#F1F5F9' }, label: { color: '#94A3B8' } }}
        />
        <TextField
          fullWidth
          margin="dense"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ input: { color: '#F1F5F9' }, label: { color: '#94A3B8' } }}
        />

        {projects.length > 0 && (
          <Typography mt={3} mb={1} fontWeight="bold" color="#F1F5F9">
            Adicionar aos Projetos
          </Typography>
        )}

        {Object.entries(groupedProjects).map(([stageLabel, grouped]) => (
          <Box key={stageLabel} mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="#94A3B8" mb={1}>
              {stageLabel}
            </Typography>

            {grouped.map(project => (
              <Box key={project.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!selectedProjects[project.id]}
                      onChange={() => handleToggleProject(project.id)}
                      sx={{ color: '#3B82F6' }}
                    />
                  }
                  label={<Typography color="#F1F5F9">{project.name}</Typography>}
                />
                {selectedProjects[project.id] && (
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: '#94A3B8' }}>Função</InputLabel>
                    <Select
                      value={selectedProjects[project.id]}
                      onChange={(e) => handleRoleChange(project.id, e.target.value)}
                      label="Função"
                      sx={{ color: '#F1F5F9' }}
                    >
                      {roles.map(role => (
                        <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#3B82F6' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
