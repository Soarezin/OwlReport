import { useEffect, useState } from "react";
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, Chip, Button, IconButton, Box, Typography,
} from "@mui/material";
import api from "../../services/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

export default function MembersPage() {
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/user-management/list-users");
                setUsers(response.data.data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchUsers();
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

    const onToggleActive = (userId: string) => {
        console.log("Alternar ativo/inativo:", userId);

    };

    return (
        <Box p={4} width="100%" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" color="white" fontWeight="bold" >Gestão de Membros</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>
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
                            {["Nome", "E-mail", "Status", "Projetos", "Criado Em", "Ações"].map(header => (
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
                                <TableCell sx={{ borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px' }}>
                                <Tooltip title="Desativar usuário">
                                    <IconButton
                                        onClick={() => onToggleActive(user.id)}
                                        sx={{
                                            color: user.isActive ? '#3B82F6' : '#94A3B8',
                                            fontSize: 32 // controla o tamanho do ícone diretamente
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
                                <TableCell sx={{ borderBottom: '1px solid #273549', paddingBottom: '4px', paddingTop: '4px', paddingLeft: '7px' }}>
                                    <Box display="flex" gap={1}>
                                        <Tooltip title="visualizar detalhes">
                                            <IconButton size="small" color="primary" onClick={() => onDelete(user.id)} aria-label="Visualizar Detalhes">
                                                <SearchIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar usuário">
                                            <IconButton size="small" color="primary" onClick={() => onEdit(user.id)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Adicionar ao um projeto">
                                            <IconButton size="small" color="secondary" onClick={() => onAddToProject(user.id)}>
                                                <PersonAddIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Remover de um projeto">
                                            <IconButton size="small" color="secondary" onClick={() => onAddToProject(user.id)}>
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
