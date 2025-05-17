import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100vh',
        width: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </Box>
  );
};

export default MainLayout;
