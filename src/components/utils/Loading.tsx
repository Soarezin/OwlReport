import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ message = "Carregando..." }: { message?: string }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      minHeight="200px"
      sx={{ color: "#94a3b8" }}
    >
      <CircularProgress sx={{ color: "#38bdf8", mb: 2 }} />
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
};

export default Loading;