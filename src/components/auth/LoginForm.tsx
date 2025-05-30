import * as React from 'react';
import {
  Box, Button, TextField, Typography, Divider, FormControl,
  FormLabel, FormControlLabel, Checkbox, Link, Stack, CircularProgress
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SignInContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: '#0f172a',
}));

const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  padding: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  backgroundColor: '#111C2D',
  border: '1px solid #38bdf86b',
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
}));

export default function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginRes = await api.post('/auth/login', { email, password });
      const token = loginRes.data.data.token;
      localStorage.setItem('token', token);

      const meRes = await api.get('/user/user-me');
      localStorage.setItem('user', JSON.stringify(meRes.data.data));

      if (remember) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInContainer>
      <Card>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/icons/logo.jpeg" style={{ width: 40, height: 40 }} />
          <Typography sx={{ color: '#F8FAFC', fontWeight: 600, fontSize: 20 }}>OwlReport</Typography>
        </Box>

        <Typography component="h1" variant="h4" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
          Entrar
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="on"
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            '& input:-webkit-autofill': {
              boxShadow: '0 0 0 1000px #1E293B inset',
              WebkitTextFillColor: '#F1F5F9',
            },
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email" sx={{ color: '#94A3B8', mb: 0.5 }}>E-mail</FormLabel>
            <TextField
              id="email"
              name="email"
              type="email"
              required
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: '#1E293B',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  color: '#F1F5F9',
                  height: 56
                },
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password" sx={{ color: '#94A3B8', mb: 0.5 }}>Senha</FormLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              required
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: '#1E293B',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
                  color: '#F1F5F9',
                  height: 56
                },
              }}
            />
          </FormControl>
{/* 
          <FormControlLabel
            control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} sx={{ color: '#38bdf8' }} />}
            label={<Typography sx={{ color: '#cbd5e1' }}>Lembrar de mim</Typography>}
          /> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(to right, #3B82F6, #2563EB)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(to right, #2563EB, #1D4ED8)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>

          <Link
            component="button"
            variant="body2"
            sx={{ color: '#94A3B8', textDecoration: 'underline', alignSelf: 'center', mt: -1 }}
            onClick={() => alert('Função de recuperação de senha ainda não implementada.')}
          >
            Esqueceu a senha?
          </Link>
        </Box>

        <Divider sx={{ color: '#fff', '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>ou</Divider>

        <Typography sx={{ color: '#94A3B8', textAlign: 'center' }}>
          Ainda não tem uma conta?{' '}
          <Link href="/register" underline="hover" sx={{ color: '#3B82F6', fontWeight: 600 }}>
            Cadastre-se
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
}
