import { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip, Button, IconButton, Box, Typography,
  Avatar, TextField, InputAdornment, Tooltip, Menu, MenuItem, Select, MenuItem as MuiMenuItem, Switch
} from "@mui/material";
import api from "../../services/api";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import AddUserModal from "./AddUserModal";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSnackbar } from "../snackbar/SnackbarContext";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Loading from "../utils/Loading";

interface ProjectWithRoleDto {
  projectUserId: string;
  projectId: string;
  projectName: string;
  roleId: string;
  roleName: string;
  roleDescription: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  projects: ProjectWithRoleDto[];
}

interface ProjectResponse {
  id: UniqueIdentifier;
  name: string;
  countOpenReports: number;
  stage: number;
}

interface RoleResponse {
  id: UniqueIdentifier;
  name: string;
  description: string;
  isActive: boolean;
}

export default function MembersPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserResponse | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { showMessage } = useSnackbar();

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/list-users");
      setUsers(response.data.data);
    } catch (error) {
      showMessage("Erro ao buscar usuários", "error");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get("/project/list-projects");
      setProjects(response.data.data);
    } catch (error) {
      showMessage("Erro ao buscar projetos", "error");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles/get-roles");
      setRoles(response.data.data);
    } catch (error) {
      showMessage("Erro ao buscar funções", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchRoles();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  const toggleUserStatus = async (userId: string) => {
    try {
      await api.post(`/user/toggle-user/${userId}`);
      fetchUsers();
    } catch (error) {
      showMessage("Erro ao alternar status do usuário", "error");
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToEdit(user);
      setOpenModal(true);
      handleMenuClose();
    }
  };

  if (!users) {
    return <Loading />;
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="white" fontWeight="bold">Gerenciamento de Membros</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Adicionar Membro
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          placeholder="Buscar por nome ou e-mail"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { color: 'white' }
          }}
          sx={{ backgroundColor: '#1e293b', input: { color: 'white' }, borderRadius: 1 }}
        />

        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ backgroundColor: '#1e293b', color: 'white', borderRadius: 1 }}
        >
          <MuiMenuItem value="all">Todos</MuiMenuItem>
          <MuiMenuItem value="active">Ativos</MuiMenuItem>
          <MuiMenuItem value="inactive">Inativos</MuiMenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: '#111C2D', borderRadius: 2, border: "1px solid #38bdf86b", WebkitBackdropFilter: "blur(8px)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuário</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Projetos</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Criado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ativo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => {
              const isNew = new Date().getTime() - new Date(user.createdAt).getTime() < 3 * 24 * 60 * 60 * 1000;
              return (
                <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#1E293B' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#1E40AF', width: 40, height: 40, fontSize: 16 }}>
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography color="white" fontWeight={500}>{user.name}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#CBD5E1' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.projects.length} size="small" color="primary" />
                  </TableCell>
                  <TableCell sx={{ color: '#CBD5E1' }}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: '#CBD5E1' }}>
                    <Switch size="small" checked={user.isActive} onChange={() => toggleUserStatus(user.id)} />    
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, user.id)}>
                      <MoreVertIcon sx={{ color: '#94A3B8' }} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedUserId === user.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleEditUser(user.id)}>Editar</MenuItem>
                      <MenuItem onClick={() => toggleUserStatus(user.id)}>
                        {user.isActive ? 'Desativar' : 'Ativar'}
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {openModal && (
        <AddUserModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setUserToEdit(null);
            fetchUsers();
          }}
          onSubmit={async (data) => {
            try {
              const response = userToEdit
                ? await api.put(`/user/update-user/${userToEdit.id}`, data)
                : await api.post("/user/register-user", data);

              if (response.data.success) {
                showMessage(userToEdit ? "Usuário atualizado!" : "Usuário criado!", "success");
                setOpenModal(false);
                setUserToEdit(null);
                fetchUsers();
              } else {
                showMessage("Erro ao salvar usuário", "error");
              }
            } catch {
              showMessage("Erro ao salvar usuário", "error");
            }
          }}
          projects={projects.map(project => ({ ...project, id: String(project.id) }))}
          roles={roles.map(role => ({ value: String(role.id), label: role.name }))}
          initialData={userToEdit ? {
            name: userToEdit.name,
            email: userToEdit.email,
            projects: userToEdit.projects.map(p => ({ projectId: p.projectId, roleId: p.roleId }))
          } : undefined}
        />
      )}
    </Box>
  );
}
