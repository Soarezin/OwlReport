import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Divider
} from "@mui/material";
import {
    LineChart,
    BarChart,
} from '@mui/x-charts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorIcon from '@mui/icons-material/Error';
import TimerIcon from '@mui/icons-material/Timer';
import api from '../../services/api';
import Loading from "../utils/Loading";
import { UniqueIdentifier } from "@dnd-kit/core";

interface Project {
    id: string;
    name: string;
    countOpenReports?: number;
    stage?: number;
    type?: string;
    icon?: React.ReactElement;
}

interface DashboardAdminProps {
    onSelectProject: (id: UniqueIdentifier) => void;
    projectsList: Project[];
}

interface ProjectChartDto {
    name: string;
    critical: number;
    low: number;
    medium: number;
    high: number;
    criticalPercent: number;
    lowPercent: number;
    mediumPercent: number;
    highPercent: number;
    total: number;
}

interface DashboardSummaryDto {
    monitoredProjects: number;
    criticalOpenErrors: number;
    totalOpenErrors: number;
    resolvedLast7Days: number;
    avgResolutionTime: string;
    totalMembers: number;
}

interface ProjectDetailsDto {
    id: UniqueIdentifier,
    name: string;
    errorSessions: number;
    averageResolutionTime: string;
    lastErrorAt: string;
}

export const fetchErrorsBySeverity = async (): Promise<{ x: string; y: number }[]> => {
    const res = await api.get("/charts/errors-by-severity");
    return res.data.data;
};

export const fetchErrorsByDate = async (range: 'day' | 'week' | 'month' | 'year') => {
    const res = await api.get(`/charts/errors-by-date`, {
        params: { range },
    });

    return res.data.data as { x: string; y: number }[];
}

export const fetchDashboardSummary = async (): Promise<DashboardSummaryDto> => {
    const res = await api.get("/charts/summary");
    return res.data.data;
};

export const fetchProjectErrorDistribution = async (): Promise<ProjectChartDto[]> => {
    const res = await api.get("/charts/projects-error-distribution");
    return res.data.data;
};

export const fetchProjectDetails = async (): Promise<ProjectDetailsDto[]> => {
    const res = await api.get("/charts/projects-details");
    return res.data.data;
};

const fillMissingHours = (data: { x: string; y: number }[]) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const filled = hours.map(hour => {
        const found = data.find(d => d.x === hour);
        return { x: hour, y: found ? found.y : 0 };
    });
    return filled;
};

const translateSeverity = (severity: string) => {
    switch (severity) {
        case "Low":
            return "Baixa";
        case "Medium":
            return "Média";
        case "High":
            return "Alta";
        case "Critical":
            return "Crítica";
        case "NoImpact":
            return "Sem Impacto";
        default:
            return severity;
    }
};

const severityColor = (s?: string): string => {
  if (!s) return '#64748b'; // cinza padrão

  switch (s.toLowerCase()) {
    case 'low':
      return '#16a34a'; // verde
    case 'medium':
      return '#ca8a04'; // amarelo escuro
    case 'high':
      return '#ea580c'; // laranja forte
    case 'critical':
      return '#e11d48'; // vermelho forte
    case "NoImpact":
      return "#38bdf8"
    default:
      return '#64748b'; // cinza
  }
};

const DashBoardAdmin = ({ onSelectProject }: DashboardAdminProps) => {
    const [selectedRange, setSelectedRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
    const [lineData, setLineData] = useState<{ x: string; y: number }[]>([]);
    const [projectsList, setProjectsList] = useState<Project[]>([]);
    const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
    const [projectStats, setProjectStats] = useState<ProjectChartDto[]>([]);
    const [projectDetails, setProjectDetails] = useState<ProjectDetailsDto[]>([]);
    const [orderBy, setOrderBy] = useState<'name' | 'errorSessions' | 'averageResolutionTime' | 'lastErrorAt'>('errorSessions');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
    const [barChartData, setBarChartData] = useState<{
        dataset: any[];
        series: { dataKey: string; label: string; color: string }[];
    }>({ dataset: [], series: [] });


    const sortProjects = (data: ProjectDetailsDto[]) => {
        return [...data].sort((a, b) => {
            const dir = orderDirection === 'asc' ? 1 : -1;
            switch (orderBy) {
                case 'name':
                    return a.name.localeCompare(b.name) * dir;
                case 'errorSessions':
                    return (a.errorSessions - b.errorSessions) * dir;
                case 'averageResolutionTime':
                    return (parseInt(a.averageResolutionTime || '0') - parseInt(b.averageResolutionTime || '0')) * dir;
                case 'lastErrorAt':
                    return (new Date(a.lastErrorAt).getTime() - new Date(b.lastErrorAt).getTime()) * dir;
                default:
                    return 0;
            }
        });
    };

    const didFetch = useRef(false);

    useEffect(() => {

        if (didFetch.current) return;
        didFetch.current = true;

        fetchDashboardSummary().then(setSummary);
        fetchProjectErrorDistribution().then(setProjectStats);
        fetchProjectDetails().then(setProjectDetails);

        fetchErrorsByDate(selectedRange).then(data => {
            const processed = selectedRange === 'day' ? fillMissingHours(data) : data;
            setLineData(processed);
        });
        fetchErrorsBySeverity().then((data) => {
            const severities = ["Low", "Medium", "High", "Critical"];
            const dataset: { x: string;[key: string]: any }[] = [{ x: "Severidade dos erros" }]; // necessário pelo formato do BarChart

            const series = severities.map((severity) => ({
                dataKey: severity,
                label: translateSeverity(severity),
                color: severityColor(severity)
            }));

            data.forEach((item) => {
                dataset[0][item.x] = item.y;
            });

            setBarChartData({ dataset, series });
        });
    }, [selectedRange]);

    if (!summary) return <Loading />;

    return (
        <Box p={4} sx={{ flexGrow: 1, overflow: "auto" }}>
            <Grid >
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            backgroundColor: "#111C2D", // #0f172a com transparência
                            borderRadius: "16px",
                            border: "1px solid",
                            borderColor: "#38bdf86b", // tom roxo claro translúcido
                            // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                            // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                            WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                            transition: "all 0.3s ease",
                        }}>
                            <CardContent sx={{ padding: "16px !important" }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <TrendingUpIcon fontSize="large" color="primary" />
                                    <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
                                        <Box>
                                            <Typography variant="subtitle2">Projetos Monitorados</Typography>
                                            <Typography variant="h5">{projectsList.length}</Typography>
                                        </Box>
                                        <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", mx: 1 }} />
                                        <Box>
                                            <Typography variant="subtitle2">Total De Membros</Typography>
                                            <Typography variant="h6" color="text.primary">
                                                {summary?.totalMembers ?? "-"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            backgroundColor: "#111C2D", // #0f172a com transparência
                            borderRadius: "16px",
                            border: "1px solid",
                            borderColor: "#38bdf86b", // tom roxo claro translúcido
                            // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                            // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                            WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                            transition: "all 0.3s ease",
                        }}>
                            <CardContent sx={{ padding: "16px !important" }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <ErrorIcon fontSize="large" sx={{ color: "#e11d48" }} />
                                    <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
                                        <Box sx={{ marginRight: "5px" }}>
                                            <Typography variant="subtitle2">Erros Críticos em Aberto</Typography>
                                            <Typography variant="h6" color="text.primary" >
                                                {summary?.criticalOpenErrors ?? "-"}
                                            </Typography>
                                        </Box>
                                        <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", mx: 1 }} />
                                        <Box>
                                            <Typography variant="subtitle2">Total de erros em Aberto</Typography>
                                            <Typography variant="h6" color="text.primary">
                                                {summary?.totalOpenErrors ?? "-"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            backgroundColor: "#111C2D", // #0f172a com transparência
                            borderRadius: "16px",
                            border: "1px solid",
                            borderColor: "#38bdf86b", // tom roxo claro translúcido
                            // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                            // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                            WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                            transition: "all 0.3s ease",
                        }}>
                            <CardContent sx={{ padding: "16px !important" }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <TimerIcon fontSize="large" sx={{ color: "#ca8a04" }} />
                                    <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
                                        <Tooltip title="Erros resolvidos nos últimos 7 dias" placement="bottom">
                                            <Box>
                                                <Typography variant="subtitle2">Erros Resolvidos</Typography>
                                                <Typography variant="h6" color="text.primary">
                                                    {summary?.resolvedLast7Days ?? "-"}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                        <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", mx: 1 }} />
                                        <Tooltip title="Média de tempo para solucionar um Report" placement="bottom">
                                            <Box>
                                                <Typography variant="subtitle2">Tempo Médio de Resolução</Typography>
                                                <Typography variant="h6" color="text.primary">
                                                    {summary?.avgResolutionTime?.split(" ")[0] ?? "-"} &  {summary?.avgResolutionTime?.split(" ")[1] ?? ""}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid display={"flex"} flexDirection={"row"} justifyContent={"space-around"} gap={2} mb={2}>
                    <Card sx={{
                        backgroundColor: "#111C2D", // #0f172a com transparência
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "#38bdf86b", // tom roxo claro translúcido
                        // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                        // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                        WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                        transition: "all 0.3s ease", width: "50%"
                    }}>
                        <CardContent>
                            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography variant="h6" gutterBottom>Erros Totais</Typography>
                                <Box display="flex" gap={1} mb={2}>
                                    {['day', 'week', 'month', 'year'].map((range) => (
                                        <Button
                                            key={range}
                                            variant={selectedRange === range ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setSelectedRange(range as any)}
                                        >
                                            {range === 'day' && 'Hoje'}
                                            {range === 'week' && '7 dias'}
                                            {range === 'month' && '30 dias'}
                                            {range === 'year' && '1 ano'}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            <LineChart
                                dataset={lineData}
                                xAxis={[{ scaleType: 'point', dataKey: 'x' }]}
                                yAxis={[{ tickMinStep: 1 }]}
                                series={[{ dataKey: 'y', label: 'Erros', color: '#60a5fa' }]}
                                height={220}
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{
                        backgroundColor: "#111C2D", // #0f172a com transparência
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "#38bdf86b", // tom roxo claro translúcido
                        // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                        // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                        WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                        transition: "all 0.3s ease", width: "50%"
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Erros Totais Por Severidade</Typography>
                            <BarChart
                                xAxis={[{ scaleType: "band", dataKey: "x" }]}
                                series={barChartData.series}
                                dataset={barChartData.dataset}
                                height={220}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid display={"flex"} flexDirection={"row"} justifyContent={"space-around"} gap={2}>
                    {/* <Card sx={{
                        backgroundColor: "#111C2D", // #0f172a com transparência
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "#38bdf86b", // tom roxo claro translúcido
                        // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                        // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                        WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                        transition: "all 0.3s ease", width: "50%"
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Erros Por Projeto</Typography>
                            {projectStats.map((project, idx) => (
                                <Box key={idx} mb={2}>
                                    <Typography variant="body2" gutterBottom>
                                        {project.name}
                                    </Typography>
                                    <Box display="flex" width="100%" height={8} borderRadius={5} overflow="hidden" sx={{ backgroundColor: "#1e293b" }}>
                                        {
                                            project.low > 0 &&
                                            <Tooltip title={`Erros em Severidade Baixa (${project.low})`} placement="bottom">
                                                <Box flex={getSafeFlex(project.lowPercent, project.total)} bgcolor="#4ade80" />
                                            </Tooltip>
                                        }
                                        {
                                            project.medium > 0 &&
                                            <Tooltip title={`Erros em Severidade Média (${project.medium})`} placement="bottom">
                                                <Box flex={getSafeFlex(project.mediumPercent, project.total)} bgcolor="#facc15" />
                                            </Tooltip>
                                        }
                                        {
                                            project.high > 0 &&
                                            <Tooltip title={`Erros em Severidade Alta (${project.high})`} placement="bottom">
                                                <Box flex={getSafeFlex(project.highPercent, project.total)} bgcolor="#f97316" />
                                            </Tooltip>
                                        }
                                        {
                                            project.critical > 0 &&
                                            <Tooltip title={`Erros em Severidade Crítica (${project.critical})`} placement="bottom" >
                                                <Box flex={getSafeFlex(project.criticalPercent, project.total)} bgcolor="#f43f5e" />
                                            </Tooltip>
                                        }
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card> */}
                    <Card sx={{
                        backgroundColor: "#111C2D", // #0f172a com transparência
                        borderRadius: "16px",
                        border: "1px solid",
                        borderColor: "#38bdf86b", // tom roxo claro translúcido
                        // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)", // sombra difusa
                        // backdropFilter: "blur(8px)", // leve efeito de desfoque para simular profundidade
                        WebkitBackdropFilter: "blur(8px)", // compatibilidade Safari
                        transition: "all 0.3s ease", width: "100%"
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Detalhes dos Projetos</Typography>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ borderBottom: '1px solid #334155' }}>
                                        {[
                                            { key: 'name', label: 'Projeto' },
                                            { key: 'errorSessions', label: 'Reports de Erro' },
                                            { key: 'averageResolutionTime', label: 'Tempo Médio de Resolução' },
                                            { key: 'lastErrorAt', label: 'Último Erro' }
                                        ].map(col => (
                                            <TableCell
                                                key={col.key}
                                                onClick={() => {
                                                    if (orderBy === col.key) {
                                                        setOrderDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                                                    } else {
                                                        setOrderBy(col.key as any);
                                                        setOrderDirection('asc');
                                                    }
                                                }}
                                                sx={{
                                                    fontSize: '16px',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    borderBottom: '1px solid #334155',
                                                    cursor: 'pointer',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {col.label}
                                                {orderBy === col.key && (orderDirection === 'asc' ? ' ↑' : ' ↓')}
                                            </TableCell>
                                        ))}
                                        <TableCell sx={{
                                            fontSize: '16px',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid #334155',
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}>Ação</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortProjects(projectDetails).map((project, idx) => (
                                        <TableRow
                                            key={idx}
                                            hover
                                            sx={{
                                                "&:hover": { backgroundColor: "#1E293B" },
                                                borderBottom: '1px solid #273549',
                                                height: 56,
                                            }}
                                        >
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', py: '4px' }}>
                                                {project.name}
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', py: '4px' }}>
                                                {project.errorSessions}
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', py: '4px' }}>
                                                {project.averageResolutionTime}
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549', py: '4px' }}>
                                                {project.lastErrorAt && !isNaN(Date.parse(project.lastErrorAt))
                                                    ? new Date(project.lastErrorAt).toLocaleString()
                                                    : "-"}
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid #273549' }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => {
                                                        onSelectProject(project.id);
                                                    }}
                                                >
                                                    Detalhes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashBoardAdmin;
