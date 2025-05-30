import { JSX, useEffect, useRef, useState } from 'react';
import { Grid, Paper, Chip, Divider, Card, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Box, Typography } from '@mui/material';
import 'rrweb-player/dist/style.css';
import Player from 'rrweb-player';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../utils/Loading';
import BugReportIcon from "@mui/icons-material/BugReport";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export interface ReportDetailResponse {
  id: string;
  pageUrl: string;
  userComment?: string;
  userAgent?: string;
  category: string;
  severity: string;
  severityColor: string;
  status: string;
  decryptedPayloadJson?: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  statusCode: number;
}

interface HttpHeader {
  key: string;
  value: string;
}

interface HttpLog {
  status: number;
  type: string;
  method: string;
  url: string;
  timestamp: string;
  statusText?: string;
  requestHeaders?: HttpHeader[];
  responseHeaders?: HttpHeader[];
  responseBody?: string | object;
}

const iconMap: Record<string, JSX.Element> = {
  "Error": <BugReportIcon fontSize="small" sx={{ color: "#e11d48" }} />,
  "Suggestion": <LightbulbIcon fontSize="small" sx={{ color: "#38bdf8" }} />,
};

const severityColor = (type: string) => {
  switch (type) {
    case "Low":
      return "#16a34a";
    case "Medium":
      return "#ca8a04";
    case "High":
      return "#ea580c";
    case "Critical":
      return "#e11d48";
    case "NoImpact":
      return "#38bdf8";
    default:
      return "#64748b";
  }
};

const translateSeverity = (severity: string) => {
  switch (severity) {
    case "Low":
      return "Severidade Baixa";
    case "Medium":
      return "Severidade Média";
    case "High":
      return "Severidade Alta";
    case "Critical":
      return "Severidade Crítica";
    case "NoImpact":
      return "Sem Impacto";
    default:
      return severity;
  }
};
const translateStatus = (status: string) => {
  switch (status) {
    case "open":
      return "Aberto";
    case "in_progress":
      return "Em Progresso";
    case "solved":
      return "Resolvido";
    default:
      return status;
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case "open":
      return "#facc15"; // amarelo
    case "in_progress":
      return "#38bdf8"; // azul claro
    case "solved":
      return "#22c55e"; // verde
    default:
      return "#94a3b8"; // cinza
  }
};

export default function ReportPreview() {
  const playerRef = useRef<HTMLDivElement>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [httpLogs, setHttpLogs] = useState<HttpLog[]>([]);

  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [consoleLogs, setConsoleLogs] = useState<
    { level: string; message: string; timestamp: string }[]
  >([]);

  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function DetailLine({ label, value, color }: { label: string, value: string, color?: string }) {
    return (
      <Typography fontSize={13} sx={{ color: '#94a3b8', mb: 0.5 }}>
        <strong style={{ color: "#e2e8f0" }}>{label}:</strong>{' '}
        <span style={{ color: color || '#cbd5e1' }}>{value}</span>
      </Typography>
    );
  }

  const fetchReport = async () => {
    try {
      const response = await api.get<ApiResponse<ReportDetailResponse>>(`/report-web/detail/${reportId}`);
      setReport(response.data.data);
    } catch (err) {
      console.error("Erro ao buscar o relatório:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reportId) return;
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    if (!report?.decryptedPayloadJson) return;

    try {
      const parsed = JSON.parse(report.decryptedPayloadJson);
      setPayload(parsed);

      if (parsed.consoleLogs) setConsoleLogs(parsed.consoleLogs);

      if (parsed.httpLogs) setHttpLogs(parsed.httpLogs);

      const replayEvents = parsed.replay?.[0]?.events ?? [];
      if (playerRef.current) {
        playerRef.current.innerHTML = '';
        try {
          new Player({
            target: playerRef.current,
            props: {
              events: replayEvents,
              showController: true,
            },
          });
        } catch (e) {
          console.error("Erro ao iniciar o player rrweb:", e);
        }
      }
    } catch (e: any) {
      console.error("Erro ao decodificar decryptedPayloadJson:", e);
      setError('Erro ao decodificar JSON');
    }
  }, [report]);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!payload) {
    return <Loading />;
  }

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <Box>
      <Typography fontSize={12} fontWeight="bold" color="#94a3b8">
        {label}
      </Typography>
      <Typography variant="body2">{value ?? "---"}</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', color: '#fff' }}>
      <Box sx={{ px: 1, py: 1, borderBottom: '1px solid #334155', bgcolor: '#0F172A', paddingBottom: 1, paddingTop: 0 }}>
        <div className="flex flex-row items-center">
          <img src="../../icons/logo.jpeg" className="w-12 h-12 mr-3" />
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                letterSpacing: '0.5px',
                color: '#F8FAFC'
              }}
            >
              OwlReport
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#94a3b8', fontSize: '14px', fontWeight: 400 }}
            >
              Projeto: Acme Inc. Dashboard
            </Typography>
          </Box>
        </div>
      </Box>

      <Box sx={{ padding: "15px", display: "flex", flexDirection: "column", overflowY: "auto", minHeight: 'calc(100vh - 81px)' }}>
        <Grid sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 2, height: "100%" }}>
          <Card sx={{ p: 2, border: "1px solid #334155", backgroundColor: "#111C2D", borderRadius: "10px", width: "60%", height: "732px" }}>
            <Typography variant="body2" fontSize={"17px"} fontWeight="bold">Replay Visual</Typography>
            <Box sx={{ color: '#fff' }}>
              <Box
                ref={playerRef}
                sx={{
                  mt: 2,
                  mx: 'auto',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: 500, // 👈 altura visível e confortável
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  backgroundColor: '#0f172a',
                }}
              />
            </Box>
          </Card>

          <Grid item xs={12} md={4} sx={{ width: "40%" }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 2,
                  border: "1px solid #334155",
                  backgroundColor: "#111C2D",
                  color: "#f1f5f9",
                }}
              >
                {/* Título + Data */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  {/* Ícone + Título + Data */}
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {/* Ícone com fundo redondo */}
                    <Box
                      sx={{
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${severityColor(report?.severity ?? "")}22`,
                      }}
                    >
                      {iconMap[report?.category as keyof typeof iconMap] ?? null}
                    </Box>

                    {/* Texto: Detalhes + Data */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2" fontSize="17px" fontWeight="bold">
                        Detalhes
                      </Typography>
                      <Typography variant="caption" fontSize={12} color="#94a3b8">
                        {report?.createdAt
                          ? new Date(report.createdAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "---"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Chips de Severidade e Status */}
                  <Box display="flex" gap={1}>
                    <Chip
                      label={translateSeverity(report?.severity ?? "")}
                      size="small"
                      sx={{
                        bgcolor: `${severityColor(report?.severity ?? "")}22`,
                        color: severityColor(report?.severity ?? ""),
                        fontWeight: 700,
                        fontSize: "11px",
                        borderRadius: "8px",
                        height: 24,
                        px: 1.2,
                      }}
                    />
                    <Chip
                      label={translateStatus(report?.status ?? "")}
                      size="small"
                      sx={{
                        bgcolor: `${statusColor(report?.status ?? "")}22`,
                        color: statusColor(report?.status ?? ""),
                        fontWeight: 700,
                        fontSize: "11px",
                        borderRadius: "8px",
                        height: 24,
                        px: 1.2,
                      }}
                    />
                  </Box>
                </Box>

                {/* Conteúdo */}
                <Stack spacing={1.5}>
                  <InfoRow label="Erro ID" value={report?.id} />
                  <InfoRow label="Página" value={report?.pageUrl} />
                  <InfoRow label="User-Agent" value={report?.userAgent ?? "Desconhecido"} />

                  <Box>
                    <Typography fontSize={12} fontWeight="bold" color="#94a3b8">
                      Categoria
                    </Typography>
                    <Chip
                      label={
                        report?.category === "Error"
                          ? "Erro"
                          : report?.category === "Suggestion"
                            ? "Sugestão"
                            : report?.category ?? "Desconhecida"
                      }
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#1e293b",
                        color:
                          report?.category === "Error"
                            ? "#facc15"
                            : "#38bdf8",
                      }}
                    />
                  </Box>

                  <InfoRow
                    label="Status"
                    value={
                      report?.status === "open"
                        ? "Aberto"
                        : report?.status === "in_progress"
                          ? "Em Progresso"
                          : report?.status === "solved"
                            ? "Resolvido"
                            : report?.status ?? "Desconhecido"
                    }
                  />
                </Stack>
              </Card>
            </Grid>

            {/* Console */}
            <Card
              sx={{
                p: 2,
                border: "1px solid #334155",
                backgroundColor: "#111C2D",
                mt: 2,
                height: "100%",
                maxHeight: 280
              }}
            >
              <Typography variant="body2" fontSize={17} fontWeight="bold" mb={1}>
                Console
              </Typography>

              <Stack spacing={0.5} sx={{ overflowY: "auto", maxHeight: 300, }}>
                {consoleLogs.length === 0 ? (
                  <Typography variant="body2" color="#94a3b8" fontSize={13}>
                    Nenhum log encontrado para este erro.
                  </Typography>
                ) : (
                  consoleLogs.map((log, index) => (
                    <Box key={index}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", fontSize: "11px", lineHeight: 1 }}
                      >
                        {log.timestamp}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            log.level === "error"
                              ? "#f87171"
                              : log.level === "warning"
                                ? "#facc15"
                                : "#cbd5e1",
                          fontSize: "13px",
                          lineHeight: 1.3,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {log.message}
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </Card>

            {/* <Card sx={{ p: 2, border: "1px solid #334155", backgroundColor: "#111C2D", mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" fontSize={"17px"} gutterBottom>Sugestão da IA</Typography>
              <Typography variant="body2">
                O erro "Login Button Doesn’t Work" pode indicar que a chamada de API para o endpoint de autenticação falhou. Verifique se o endpoint está correto e acessível.
              </Typography>
            </Card> */}

          </Grid>
        </Grid>
        <Card sx={{ p: 2, border: "1px solid #334155", backgroundColor: "#111C2D", mt: 2 }}>
          <Typography variant="body2" fontSize={"17px"} fontWeight="bold">Requisições HTTP</Typography>
          <TableContainer sx={{ borderRadius: 2, background: '#0F172A' }}>
            <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }}>Método</TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }}>Endpoint</TableCell>
                  <TableCell sx={{ color: '#cbd5e1', fontWeight: 700 }}>Horário</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {httpLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8' }}>
                      Nenhuma requisição HTTP registrada.
                    </TableCell>
                  </TableRow>
                )}

                {httpLogs.map((log, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      sx={{
                        backgroundColor: '#1E293B',
                        transition: 'all 0.2s',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#273549' },
                        '& td': {
                          border: 'none',
                          fontSize: '13px',
                          color: '#f1f5f9',
                        }
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setOpenRow(openRow === index ? null : index)}
                          sx={{ color: "#94a3b8" }}
                        >
                          {openRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ color: log.status >= 400 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                        {log.status ?? '--'}
                      </TableCell>
                      <TableCell sx={{ textTransform: 'uppercase', color: '#fbbf24' }}>
                        {log.method ?? '--'}
                      </TableCell>
                      <TableCell sx={{ color: '#e2e8f0', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.url ?? '--'}
                      </TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>
                        {log.timestamp ?? '--'}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 0 }}>
                        <Collapse in={openRow === index} timeout="auto" unmountOnExit>
                          <Box sx={{ background: "#0F172A", px: 3, py: 2, borderRadius: 1, mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: "#cbd5e1", mb: 1 }}>🌐 Geral</Typography>
                            <Box sx={{ pl: 1 }}>
                              <DetailLine label="Request URL" value={log.url ?? '---'} />
                              <DetailLine label="Method" value={log.method ?? '---'} />
                              <DetailLine
                                label="Status"
                                value={`${log.status ?? '--'} ${log.statusText ?? ''}`}
                                color={log.status >= 400 ? "#ef4444" : "#10b981"}
                              />
                            </Box>

                            <Typography variant="subtitle2" sx={{ color: "#cbd5e1", mt: 2, mb: 1 }}>📥 Request Headers</Typography>
                            <Box sx={{ pl: 1 }}>
                              {log.requestHeaders?.length
                                ? log.requestHeaders.map((h, i) => (
                                  <DetailLine key={i} label={h.key} value={h.value} />
                                ))
                                : <Typography fontSize={12} color="#64748b">Nenhum header</Typography>}
                            </Box>

                            <Typography variant="subtitle2" sx={{ color: "#cbd5e1", mt: 2, mb: 1 }}>📤 Response Headers</Typography>
                            <Box sx={{ pl: 1 }}>
                              {log.responseHeaders?.length
                                ? log.responseHeaders.map((h, i) => (
                                  <DetailLine key={i} label={h.key} value={h.value} />
                                ))
                                : <Typography fontSize={12} color="#64748b">Nenhum header</Typography>}
                            </Box>

                            {log.responseBody && (
                              <>
                                <Typography variant="subtitle2" sx={{ color: "#cbd5e1", mt: 2, mb: 1 }}>📦 Body</Typography>
                                <Box sx={{ background: "#1E293B", p: 2, borderRadius: 1 }}>
                                  <pre style={{ margin: 0, fontSize: 12, color: "#f1f5f9", whiteSpace: "pre-wrap" }}>
                                    {typeof log.responseBody === 'string'
                                      ? log.responseBody
                                      : JSON.stringify(log.responseBody, null, 2)}
                                  </pre>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Box>
  );
}