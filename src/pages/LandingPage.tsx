import React from "react";
import { useState } from "react";
import TabsComponent from "../components/landing/TabsComponent";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Box,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  MonitorRounded,
  CameraAltRounded,
  BugReportRounded,
  AccessTimeRounded,
  SecurityRounded,
  FlashOnRounded,
  PlayArrowRounded,
  VisibilityRounded,
  BarChartRounded,
  PeopleRounded,
  CheckRounded,
  ArrowRightAltRounded,
  StarRounded,
  ViewKanbanRounded,
  MenuRounded,
} from "@mui/icons-material";

const Index = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [activeTab, setActiveTab] = useState("kanban");
  const renderTabContent = () => {
    switch (activeTab) {
      case "kanban":
        return (
          // Aqui vai o seu quadro Kanban completo (todo o Grid container com as colunas)
          <Typography variant="body2" color="white">
            {/* Placeholder: substituir pelo conteúdo do Kanban original */}
            Conteúdo do quadro Kanban aqui
          </Typography>
        );
      case "replay":
        return (
          <Box color="#94a3b8">
            <Typography variant="h6">Reprodução de Sessões</Typography>
            <Typography variant="body2" mt={1}>
              Veja gravações de sessões reais com reprodução pixel-perfect
              usando rrweb.
            </Typography>
          </Box>
        );
      case "screenshot":
        return (
          <Box color="#94a3b8">
            <Typography variant="h6">Capturas de Tela</Typography>
            <Typography variant="body2" mt={1}>
              Capturas automáticas em momentos críticos para análise visual
              detalhada.
            </Typography>
          </Box>
        );
      case "console":
        return (
          <Box color="#94a3b8">
            <Typography variant="h6">Logs de Console</Typography>
            <Typography variant="body2" mt={1}>
              Monitoramento dos logs em tempo real durante a navegação do
              usuário.
            </Typography>
          </Box>
        );
      case "network":
        return (
          <Box color="#94a3b8">
            <Typography variant="h6">Requisições de Rede</Typography>
            <Typography variant="body2" mt={1}>
              Logs de todas as chamadas de rede feitas pela aplicação.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "#0a1120", color: "white", minHeight: "100vh" }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(10, 17, 32, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold">
            OwlReport
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuRounded />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: "#0f172a",
                    color: "white",
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>Funcionalidades</MenuItem>
                <MenuItem onClick={handleMenuClose}>Preços</MenuItem>
                <MenuItem onClick={handleMenuClose}>Contato</MenuItem>
                <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                <MenuItem onClick={handleMenuClose}>Entrar</MenuItem>
                <MenuItem onClick={handleMenuClose}>Começar Agora</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Button color="inherit" href="#funcionalidades">
                  Funcionalidades
                </Button>
                <Button color="inherit" href="#precos">
                  Preços
                </Button>
                <Button color="inherit" href="#contato">
                  Contato
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button color="inherit">Entrar</Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#0ea5e9",
                    "&:hover": { backgroundColor: "#38bdf8" },
                  }}
                >
                  Começar Agora
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ py: 10 }}>
        <Box textAlign="center">
          <Chip
            label="🚀 Monitore suas aplicações em tempo real"
            sx={{
              mb: 3,
              backgroundColor: "rgba(14, 165, 233, 0.2)",
              color: "#38bdf8",
              border: "1px solid rgba(14, 165, 233, 0.3)",
              fontWeight: 500,
            }}
          />

          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            mb={3}
            sx={{
              background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Facilite o suporte do seu sistema
          </Typography>

          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            maxWidth="800px"
            mx="auto"
            mb={4}
            sx={{ color: "#94a3b8" }}
          >
            Centralize bugs, sugestões e melhorias em uma única plataforma que
            conecta seus usuários com sua equipe de suporte através de
            reproduções precisas de sessões.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              justifyContent: "center",
              mb: 8,
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowRounded />}
              sx={{
                backgroundColor: "#0ea5e9",
                "&:hover": { backgroundColor: "#38bdf8" },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Começar Agora
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowRightAltRounded />}
              sx={{
                borderColor: "rgba(148, 163, 184, 0.5)",
                color: "#94a3b8",
                "&:hover": { borderColor: "#94a3b8" },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Ver Funcionalidades
            </Button>
          </Box>

          {/* Preview mockup */}
          <Paper
            elevation={24}
            sx={{
              maxWidth: "1000px",
              mx: "auto",
              background:
                "linear-gradient(to right, rgba(14, 165, 233, 0.2), rgba(168, 85, 247, 0.2))",
              p: 0.5,
              borderRadius: 4,
            }}
          >
            <Paper
              sx={{
                backgroundColor: "#0f172a",
                borderRadius: 4,
                p: 3,
                color: "white",
              }}
            >
              {/* Window Controls */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#f87171",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#facc15",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#4ade80",
                    }}
                  ></Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ color: "#94a3b8" }}
                >
                  OwlReport
                </Typography>
              </Box>

              {/* Tabs */}
              <TabsComponent />
              
            </Paper>
          </Paper>
        </Box>
      </Container>

      {/* Features Section */}
      <Box
        id="funcionalidades"
        sx={{ py: 10, backgroundColor: "rgba(15, 23, 42, 0.5)" }}
      >
        <Container>
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" component="h2" fontWeight="bold" mb={2}>
              Funcionalidades Avançadas
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{ color: "#94a3b8", maxWidth: "800px", mx: "auto" }}
            >
              Tudo que você precisa para monitorar e debuggar suas aplicações
              web
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  "&:hover": { borderColor: "rgba(14, 165, 233, 0.5)" },
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Gravação de Sessões"
                  titleTypographyProps={{ color: "white" }}
                  avatar={
                    <CameraAltRounded
                      sx={{ color: "#0ea5e9", fontSize: "2.5rem" }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Capture cada interação do usuário com tecnologia rrweb para
                    reprodução pixel-perfect
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  "&:hover": { borderColor: "rgba(14, 165, 233, 0.5)" },
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Detecção de Erros"
                  titleTypographyProps={{ color: "white" }}
                  avatar={
                    <BugReportRounded
                      sx={{ color: "#0ea5e9", fontSize: "2.5rem" }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Monitore erros no console em tempo real e correlacione com
                    as ações do usuário
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  "&:hover": { borderColor: "rgba(14, 165, 233, 0.5)" },
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Capturas de Tela"
                  titleTypographyProps={{ color: "white" }}
                  avatar={
                    <MonitorRounded
                      sx={{ color: "#0ea5e9", fontSize: "2.5rem" }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Gere capturas automáticas em momentos críticos para análise
                    visual completa
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  "&:hover": { borderColor: "rgba(14, 165, 233, 0.5)" },
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Monitoramento de Rede"
                  titleTypographyProps={{ color: "white" }}
                  avatar={
                    <BarChartRounded
                      sx={{ color: "#0ea5e9", fontSize: "2.5rem" }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Rastreie todas as requisições HTTP e identifique gargalos de
                    performance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  "&:hover": { borderColor: "rgba(14, 165, 233, 0.5)" },
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Tempo Real"
                  titleTypographyProps={{ color: "white" }}
                  avatar={
                    <AccessTimeRounded
                      sx={{ color: "#0ea5e9", fontSize: "2.5rem" }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Receba notificações instantâneas quando erros críticos
                    acontecem
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  "&:hover": { borderColor: "rgba(14, 165, 233, 0.5)" },
                  transition: "border-color 0.3s",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Dados Seguros"
                  titleTypographyProps={{ color: "white" }}
                  avatar={
                    <SecurityRounded
                      sx={{ color: "#0ea5e9", fontSize: "2.5rem" }}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Seus dados são criptografados e armazenados com segurança
                    máxima
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Typography variant="h3" component="h2" fontWeight="bold" mb={3}>
              Acelere seu processo de debugging
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{ color: "#94a3b8", mb: 4 }}
            >
              Reduza o tempo de identificação e resolução de bugs em até 90% com
              reproduções precisas das sessões dos usuários.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <CheckRounded sx={{ color: "#4ade80", mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="white"
                  >
                    Reprodução Precisa
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Veja exatamente o que o usuário fez antes do erro acontecer
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <CheckRounded sx={{ color: "#4ade80", mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="white"
                  >
                    Suporte Eficiente
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Resolva tickets de suporte mais rapidamente com contexto
                    completo
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <CheckRounded sx={{ color: "#4ade80", mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="white"
                  >
                    Melhoria Contínua
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Use dados reais para melhorar a experiência do usuário
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper
              elevation={4}
              sx={{
                background:
                  "linear-gradient(to bottom right, rgba(14, 165, 233, 0.2), rgba(168, 85, 247, 0.2))",
                p: 4,
                borderRadius: 4,
              }}
            >
              <Paper sx={{ backgroundColor: "#1e293b", p: 3, borderRadius: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <PeopleRounded
                    sx={{ color: "#0ea5e9", fontSize: "2rem", mr: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="white"
                    >
                      +50.000 sessões
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      monitoradas este mês
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                      Bugs resolvidos
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: "#4ade80" }}
                    >
                      +1.234
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                      Tempo médio resolução
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: "#38bdf8" }}
                    >
                      -85%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                      Satisfação suporte
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      {[...Array(5)].map((_, index) => (
                        <StarRounded
                          key={index}
                          sx={{ color: "#facc15", fontSize: "1rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box
        id="precos"
        sx={{ py: 10, backgroundColor: "rgba(15, 23, 42, 0.5)" }}
      >
        <Container>
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" component="h2" fontWeight="bold" mb={2}>
              Preços Transparentes
            </Typography>
            <Typography variant="h6" component="p" sx={{ color: "#94a3b8" }}>
              Escolha o plano ideal para sua equipe
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ maxWidth: "1100px", mx: "auto" }}
          >
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Starter"
                  titleTypographyProps={{ color: "white", variant: "h5" }}
                  subheader={
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="white"
                      mt={1}
                    >
                      R$ 99
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{ color: "#94a3b8" }}
                      >
                        /mês
                      </Typography>
                    </Typography>
                  }
                />
                <CardContent>
                  <Box
                    component="ul"
                    sx={{ listStyleType: "none", p: 0, m: 0 }}
                  >
                    {[
                      "Até 10.000 sessões/mês",
                      "Gravação básica",
                      "Detecção de erros",
                      "Suporte por email",
                    ].map((item) => (
                      <Box
                        component="li"
                        key={item}
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <CheckRounded
                          sx={{ color: "#4ade80", mr: 1, fontSize: "1rem" }}
                        />
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      backgroundColor: "#475569",
                      "&:hover": { backgroundColor: "#64748b" },
                    }}
                  >
                    Começar
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #0ea5e9",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                  }}
                >
                  <Chip
                    label="Mais Popular"
                    sx={{
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <CardHeader
                  title="Professional"
                  titleTypographyProps={{ color: "white", variant: "h5" }}
                  subheader={
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="white"
                      mt={1}
                    >
                      R$ 299
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{ color: "#94a3b8" }}
                      >
                        /mês
                      </Typography>
                    </Typography>
                  }
                />
                <CardContent>
                  <Box
                    component="ul"
                    sx={{ listStyleType: "none", p: 0, m: 0 }}
                  >
                    {[
                      "Até 100.000 sessões/mês",
                      "Gravação avançada",
                      "Análise de performance",
                      "Suporte prioritário",
                      "Integrações avançadas",
                    ].map((item) => (
                      <Box
                        component="li"
                        key={item}
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <CheckRounded
                          sx={{ color: "#4ade80", mr: 1, fontSize: "1rem" }}
                        />
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      backgroundColor: "#0ea5e9",
                      "&:hover": { backgroundColor: "#38bdf8" },
                    }}
                  >
                    Começar
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  height: "100%",
                }}
              >
                <CardHeader
                  title="Enterprise"
                  titleTypographyProps={{ color: "white", variant: "h5" }}
                  subheader={
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="white"
                      mt={1}
                    >
                      Personalizado
                    </Typography>
                  }
                />
                <CardContent>
                  <Box
                    component="ul"
                    sx={{ listStyleType: "none", p: 0, m: 0 }}
                  >
                    {[
                      "Sessões ilimitadas",
                      "Deploy on-premise",
                      "SLA garantido",
                      "Suporte dedicado",
                      "Customizações",
                    ].map((item) => (
                      <Box
                        component="li"
                        key={item}
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <CheckRounded
                          sx={{ color: "#4ade80", mr: 1, fontSize: "1rem" }}
                        />
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      backgroundColor: "#475569",
                      "&:hover": { backgroundColor: "#64748b" },
                    }}
                  >
                    Falar Conosco
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container sx={{ py: 10 }}>
        <Box textAlign="center">
          <Typography variant="h3" component="h2" fontWeight="bold" mb={2}>
            Pronto para acelerar seu debugging?
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ color: "#94a3b8", mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            Junte-se a centenas de equipes que já revolucionaram seu processo de
            suporte técnico
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<FlashOnRounded />}
            sx={{
              backgroundColor: "#0ea5e9",
              "&:hover": { backgroundColor: "#38bdf8" },
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Começar Teste Gratuito
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid rgba(30, 41, 59, 0.8)",
          backgroundColor: "#0a1120",
          py: 6,
        }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
                WebMonitor
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Monitore e debuggue suas aplicações web com precisão
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="white"
                mb={2}
              >
                Produto
              </Typography>
              <Box component="ul" sx={{ listStyleType: "none", p: 0, m: 0 }}>
                {["Funcionalidades", "Preços", "Documentação"].map((item) => (
                  <Box component="li" key={item} mb={1}>
                    <Button
                      sx={{
                        color: "#94a3b8",
                        p: 0,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        "&:hover": {
                          color: "white",
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="white"
                mb={2}
              >
                Suporte
              </Typography>
              <Box component="ul" sx={{ listStyleType: "none", p: 0, m: 0 }}>
                {["Central de Ajuda", "Contato", "Status"].map((item) => (
                  <Box component="li" key={item} mb={1}>
                    <Button
                      sx={{
                        color: "#94a3b8",
                        p: 0,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        "&:hover": {
                          color: "white",
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="white"
                mb={2}
              >
                Legal
              </Typography>
              <Box component="ul" sx={{ listStyleType: "none", p: 0, m: 0 }}>
                {["Privacidade", "Termos", "Cookies"].map((item) => (
                  <Box component="li" key={item} mb={1}>
                    <Button
                      sx={{
                        color: "#94a3b8",
                        p: 0,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        "&:hover": {
                          color: "white",
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(30, 41, 59, 0.8)" }} />

          <Typography variant="body2" color="#94a3b8" textAlign="center">
            &copy; 2025 OwlReport. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
