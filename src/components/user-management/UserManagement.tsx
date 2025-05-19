import { useEffect, useState } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, Chip, Button, IconButton, Box, Typography,
} from "@mui/material";
import api from "../../services/api";
import AddIcon from "@mui/icons-material/Add";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import AddUserModal from "./AddUserModal";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSnackbar } from "../snackbar/SnackbarContext";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

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
    const { showMessage } = useSnackbar();

    const fetchUsers = async () => {
        try {
            const response = await api.get("/user-management/list-users");
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
            const response = await api.get("/user-management/get-roles");
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

    const onEdit = (userId: string) => {
        console.log("Editar:", userId);
    };

    const onAddToProject = (userId: string) => {
        console.log("Adicionar a projeto:", userId);
    };

    const onDelete = (userId: string) => {
        console.log("Excluir:", userId);
    };

    const onToggleActive = async (userId: string) => {
        const response = await api.post(`user-management/toggle-user/${userId}`)
        if (response.status === 200) {
            await fetchUsers();
        } else {
            showMessage("Erro ao desativar usuário", "error");
        }
    };

    return (
        <Box p={4} width="100%" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" color="white" fontWeight="bold" >Gerenciamento de Membros</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                    Adicionar Usuário
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: '#111C2D',
                    borderRadius: 3,
                    border: "1px solid #334155",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ borderBottom: '1px solid #334155' }}>
                            {["Nome", "E-mail", "Ativo", "Projetos", "Criado Em", "Ações"].map(header => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        fontSize: '16px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        borderBottom: '1px solid #334155'
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow
                                key={user.id}
                                hover
                                sx={{
                                    "&:hover": { backgroundColor: "#1E293B" },
                                    borderBottom: '1px solid #273549',
                                    height: 56,
                                }}
                            >
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px' }}>{user.name}</TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px' }}>{user.email}</TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px', paddingLeft:'9px' }}>
                                    <Tooltip title="Desativar usuário">
                                        <IconButton
                                            onClick={() => onToggleActive(user.id)}
                                            sx={{
                                                color: user.isActive ? '#3B82F6' : '#94A3B8',
                                                fontSize: 32
                                            }}
                                        >
                                            {user.isActive
                                                ? <ToggleOnIcon sx={{ fontSize: 32 }} />
                                                : <ToggleOffIcon sx={{ fontSize: 32 }} />}
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px', paddingLeft: '33px' }}>
                                    <Tooltip title="Projetos que o usuário tem acesso">
                                        <Chip
                                            label={user.projects.length}
                                            color="primary"
                                            size="small"
                                            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                        />
                                    </Tooltip>
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px', paddingLeft: '25px' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px', paddingLeft: '24px' }}>
                                    <Box display="flex" gap={1}>
                                        <Tooltip title="visualizar detalhes">
                                            <IconButton size="small" color="primary" onClick={() => onDelete(user.id)} aria-label="Visualizar / Editar / Gerenciar Acesso">
                                                <ManageAccountsIcon />
                                            </IconButton>
                                        </Tooltip>                                       
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <AddUserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={async (data) => {
                    try {
                        const response = await api.post("/user-management/register-user", data);
                        if (response.data.success) {
                            showMessage("Usuário criado com sucesso!", "success");
                            setOpenModal(false);
                            await fetchUsers();
                        } else {
                            showMessage("Erro ao cadastrar usuário", "error");
                        }
                    } catch (error) {
                        showMessage("Erro ao cadastrar usuário", "error");
                    }
                }}
                projects={projects.map(project => ({ ...project, id: String(project.id) }))}
                roles={roles.map(role => ({ value: String(role.id), label: role.name }))}
            />
        </Box>


    );
}
