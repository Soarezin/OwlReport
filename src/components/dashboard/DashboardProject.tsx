import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Tooltip,
  Toolbar
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorIcon from '@mui/icons-material/Error';
import TimerIcon from '@mui/icons-material/Timer';
import api from '../../services/api';
import { LineChart, BarChart } from '@mui/x-charts';
import Loading from '../utils/Loading';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { motion } from 'framer-motion';
// Tipos
interface DashboardData {
  totalReports: number;
  openReports: number;
  resolvedReports: number;
  countCritical: number;
  countHigh: number;
  countMedium: number;
  countLow: number;
  avgResTime: string;
  lastReport: { message: string; pageUrl: string; createdAt: string } | null;
  topErrors: { message: string; count: number }[];
  reportsByDay: { date: string; count: number }[];
  topPages: { pageUrl: string; count: number }[];
  details: { name: string; errorSessions: number; avgResolutionTime?: string; lastErrorAt?: string }[];
}
interface LiveReport { id: string; message: string; severity: string; createdAt: string }

interface DashboardProjectProps {
  projectId: string;
  stage?: number; // ou string, dependendo do seu tipo
  name?: string;
}

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
    default:
      return '#64748b'; // cinza
  }
};

export const fetchErrorsByDate = async (projectId: string, range: 'day' | 'week' | 'month' | 'year') => {
  const res = await api.get(`/charts/project-errors-by-date/${projectId}`, {
    params: { range },
  });
  return res.data.data as { x: string; y: number }[];
};

const fillMissingHours = (data: { x: string; y: number }[]) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const filled = hours.map(hour => {
    const found = data.find(d => d.x === hour);
    return { x: hour, y: found ? found.y : 0 };
  });
  return filled;
};

const parseDate = (raw?: string | null): Date => {
  if (!raw || typeof raw !== 'string') return new Date('Invalid');

  const date = new Date(raw);
  return isNaN(date.getTime()) ? new Date('Invalid') : date;
};

const ProjectDashboard = ({ projectId, stage, name }: DashboardProjectProps) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [live, setLive] = useState<LiveReport[]>([]);
  const [selectedRange, setSelectedRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [lineData, setLineData] = useState<{ x: string; y: number }[]>([]);
  const stageStyles: Record<string, { label: string; color: string }> = {
    prod: { label: 'Produção', color: '#16a34a' },
    homolog: { label: 'Homologação', color: '#facc15' },
    dev: { label: 'Desenvolvimento', color: '#3b82f6' },
    test: { label: 'Teste', color: '#a855f7' },
  };

  const stageMap: Record<number, keyof typeof stageStyles> = {
    1: 'dev',
    2: 'test',
    3: 'homolog',
    4: 'prod',
  };

  const stageKey = stageMap[stage ?? 0];
  const currentStage = stageKey ? stageStyles[stageKey] : {
    label: 'Desconhecido',
    color: '#64748b',
  };


  const [barChartData, setBarChartData] = useState<{
    dataset: any[];
    series: { dataKey: string; label: string; color: string }[];
  }>({ dataset: [], series: [] });

  useEffect(() => {
    // Dados principais
    console.log(stage)
    api.get(`/charts/project-data/${projectId}`).then(res => {
      const d = res.data.data;
      setData(d);

      const dataset = [{
        x: "Severidade dos erros",
        Low: d.countLow,
        Medium: d.countMedium,
        High: d.countHigh,
        Critical: d.countCritical
      }];

      const series = [
        { dataKey: "Low", label: "Baixa", color: "#16a34a" },
        { dataKey: "Medium", label: "Média", color: "#ca8a04" },
        { dataKey: "High", label: "Alta", color: "#ea580c" },
        { dataKey: "Critical", label: "Crítica", color: "#e11d48" }
      ];

      setBarChartData({ dataset, series });
    });

    // Erros por data
    fetchErrorsByDate(projectId, selectedRange).then(data => {
      const processed = selectedRange === 'day' ? fillMissingHours(data) : data;
      setLineData(processed);
    });

    // Feed ao vivo
    api.get(`/charts/live/${projectId}`).then(res => {
      if (Array.isArray(res.data.data)) {
        setLive(res.data.data);
      } else if (res.data.data) {
        setLive(prev => [res.data.data, ...prev]);
      }
    });
  }, [projectId, selectedRange]);



  if (!data) return <Loading />;

  const byDay = data.reportsByDay || [];
  const details = data.details || [];

  return (
    <Box p={0}>
      <Toolbar
        disableGutters
        sx={{
          minHeight: '40px !important',
          height: '60px',
          px: 2,
          justifyContent: 'space-between',

        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} width={'100%'} justifyContent={'space-between'} paddingTop={3} paddingBottom={3} paddingLeft={0.5} paddingRight={0.5} height={'100%'}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="#fff"
            fontSize={18}
            letterSpacing={0.3}
          >
            {name || 'Métricas do Projeto'}
          </Typography>

          <Chip
            label={currentStage.label}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase',
              bgcolor: `${currentStage.color}22`, // cor com transparência
              color: currentStage.color,
              px: 1.5,
              height: 22,
              borderRadius: '6px',
              letterSpacing: 0.5,
            }}
            icon={
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: currentStage.color,
                  borderRadius: '50%',
                  ml: '4px',
                }}
              />
            }
          />
        </Box>
      </Toolbar>
      <Grid p={2} paddingTop={0}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              backgroundColor: "#111C2D", // #0f172a com transparência
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "#38bdf86b", // tom roxo 
              // claro translúcido
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
                      <Typography variant="subtitle2">Total de Reports</Typography>
                      <Typography variant="h5">{data.totalReports}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", mx: 1 }} />
                    <Box>
                      <Typography variant="subtitle2">Reports em Aberto</Typography>
                      <Typography variant="h6" color="text.primary">
                        {data?.openReports ?? "-"}
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
                        {data.countCritical}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", mx: 1 }} />
                    <Box>
                      <Typography variant="subtitle2">Último Report</Typography>
                      <Typography variant="h6" color="text.primary">
                        {parseDate(data?.lastReport?.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                        }) +
                          ' ' +
                          parseDate(data?.lastReport?.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                          {data.resolvedReports}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "#334155", mx: 1 }} />
                    <Tooltip title="Média de tempo para solucionar um Report" placement="bottom">
                      <Box>
                        <Typography variant="subtitle2">Tempo Médio de Resolução</Typography>
                        <Typography variant="h6" color="text.primary">
                          {data?.avgResTime?.split(" ")[0] ?? "-"} &  {data?.avgResTime?.split(" ")[1] ?? ""}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid display={"flex"} flexDirection={"row"} justifyContent={"space-around"} gap={2} mb={2}>
          <Card sx={{ bgcolor: '#111C2D', border: '1px solid #38bdf86b', borderRadius: 2, width: '50%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
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
                height={200}
              />
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#111C2D', border: '1px solid #38bdf86b', borderRadius: 2, width: '50%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Erros por Severidade</Typography>
              <BarChart
                xAxis={[{ scaleType: "band", dataKey: "x" }]}
                series={barChartData.series}
                dataset={barChartData.dataset}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Feed ao vivo */}
        <Card sx={{ bgcolor: '#111C2D', border: '1px solid #38bdf86b', borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              {[
                { title: 'Críticos', key: 'critical', color: '#e11d48' },
                { title: 'Altos', key: 'high', color: '#f97316' },
                { title: 'Médios / Baixos', key: 'medium-low', color: '#eab308' },
              ].map((section) => {
                const filtered = live.filter((r) =>
                  section.key === 'medium-low'
                    ? ['medium', 'low'].includes(r.severity.toLowerCase())
                    : r.severity.toLowerCase() === section.key
                );

                return (
                  <Grid item xs={12} md={4} key={section.key}>
                    <Box
                      sx={{
                        maxHeight: 320,
                        bgcolor: '#0f172a',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #1e293b',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: '#f8fafc', fontWeight: 600, textTransform: 'uppercase', fontSize: 13 }}
                        >
                          {section.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: '#1e293b',
                            color: '#94a3b8',
                            px: 1.5,
                            py: 0.2,
                            borderRadius: 8,
                            fontSize: 11,
                          }}
                        >
                          {filtered.length} erro{filtered.length !== 1 && 's'}
                        </Typography>
                      </Box>
                      <Box sx={{ maxHeight: 260, overflowY: 'auto', pr: 1 }}>
                        <List dense>
                          {filtered.map((r, idx) => {
                            const date = new Date(r.createdAt);
                            const formattedDate = !isNaN(date.getTime())
                              ? date.toLocaleString('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })
                              : 'Data inválida';

                            return (
                              <motion.div
                                key={r.id + idx}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.03 }}
                              >
                                <ListItem
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    bgcolor: '#1e293b',
                                    borderRadius: 2,
                                    mb: 1,
                                    px: 2,
                                    py: 1.2,
                                    transition: 'background 0.2s',
                                    '&:hover': {
                                      bgcolor: '#273549',
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      bgcolor: severityColor(r.severity),
                                      borderRadius: '50%',
                                      mt: 0.5,
                                    }}
                                  />
                                  <Box flex={1}>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: '#f1f5f9', fontSize: 13, fontWeight: 500 }}
                                    >
                                      {r.message}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: 11 }}>
                                      {formattedDate}
                                    </Typography>
                                  </Box>

                                  <Chip
                                    size="small"
                                    label={translateSeverity(r.severity)}
                                    sx={{
                                      bgcolor: `${severityColor(r.severity)}22`, // cor com transparência
                                      color: severityColor(r.severity),
                                      fontWeight: 600,
                                      height: 24,
                                      fontSize: 11,
                                      borderRadius: '6px',
                                    }}
                                  />
                                </ListItem>
                              </motion.div>
                            );
                          })}
                        </List>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default ProjectDashboard;
