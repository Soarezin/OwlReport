import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  OutlinedInput,
  Collapse
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  const [expandedStage, setExpandedStage] = useState<string | false>(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setEmail(initialData.email);

      const map: Record<string, string> = {};
      initialData.projects.forEach((p) => {
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
    setSelectedProjects((prev) => {
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
      case 1:
        return "Desenvolvimento";
      case 2:
        return "Teste";
      case 3:
        return "Homologação";
      case 4:
        return "Produção";
      default:
        return "Outro";
    }
  }

  const handleRoleChange = (projectId: string, role: string) => {
    setSelectedProjects((prev) => ({ ...prev, [projectId]: role }));
  };

  const handleAccordionToggle = (stage: string) => {
    setExpandedStage((prev) => (prev === stage ? false : stage));
  };

  const handleBackdropClick = (e: any) => {
    e.stopPropagation();
    setAlert(true);
    setTimeout(() => setAlert(false), 500);
  };

  const handleSubmit = () => {
    const formattedProjects = Object.entries(selectedProjects).map(
      ([projectId, role]) => ({
        projectId,
        role,
      })
    );
    onSubmit({
      name,
      email,
      projectRoles: formattedProjects.map((p) => ({
        projectId: p.projectId,
        roleId: p.role,
      })),
    });
    setName("");
    setEmail("");
    setSelectedProjects({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') handleBackdropClick(event);
        else onClose();
      }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#111C2D",
          borderRadius: 2,
          color: "#F1F5F9",
          backgroundImage: "none",
          animation: alert ? 'pulse-border 0.6s ease-in-out' : 'none',
          border: alert ? '2px solid #3B82F6' : '2px solid transparent'
        },
      }}
    >
      <DialogTitle
        sx={{ color: "#F1F5F9", fontWeight: "bold", fontSize: "1.25rem" }}
      >
        Adicionar Novo Membro
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nome"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: "12px",
              backgroundColor: "#1E293B",
              color: "#F1F5F9",
            },
          }}
          InputLabelProps={{ sx: { color: "#94A3B8" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="E-mail"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: "12px",
              backgroundColor: "#1E293B",
              color: "#F1F5F9",
            },
          }}
          InputLabelProps={{ sx: { color: "#94A3B8" } }}
        />

        <Divider sx={{ backgroundColor: "#1E293B", my: 3 }} />

        {projects.length > 0 && (
          <Typography
            mb={1}
            fontWeight="bold"
            color="#F1F5F9"
            sx={{ marginLeft: 1.5 }}
          >
            Adicionar aos Projetos
          </Typography>
        )}

        <Box>
          {Object.entries(groupedProjects).map(([stageLabel, grouped]) => (
            <Box key={stageLabel} mb={2}>
              <Box
                onClick={() => handleAccordionToggle(stageLabel)}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#1E293B" },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="#94A3B8"
                >
                  {stageLabel}
                </Typography>
                <ExpandMoreIcon
                  sx={{
                    transform:
                      expandedStage === stageLabel
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.2s ease-in-out",
                    color: "#94A3B8",
                  }}
                />
              </Box>

              <Collapse in={expandedStage === stageLabel} timeout="auto" unmountOnExit>
                <Box pl={2} mt={2}>
                  {grouped.map((project) => (
                    <Box key={project.id} mb={3}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography>{project.name}</Typography>
                        <Switch
                          checked={!!selectedProjects[project.id]}
                          onChange={() => handleToggleProject(project.id)}
                        />
                      </Box>
                      {selectedProjects[project.id] && (
                        <Box mt={1}>
                          <FormControl
                            size="small"
                            sx={{
                              width: '100%',
                              maxWidth: 220,
                              backgroundColor: "#1E293B",
                              borderRadius: "12px",
                              mt: 1,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#334155",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3B82F6",
                              },
                            }}
                          >
                            <InputLabel sx={{ color: "#94A3B8" }}>Função</InputLabel>
                            <Select
                              value={selectedProjects[project.id]}
                              onChange={(e) =>
                                handleRoleChange(project.id, e.target.value)
                              }
                              label="Função"
                              sx={{ color: "#F1F5F9" }}
                            >
                              {roles.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                  {role.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: "#3B82F6" }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>

      <style>{`
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </Dialog>
  );
}