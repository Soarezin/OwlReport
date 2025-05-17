import { useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export default function  LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleLogin = async () => {
        setLoading(true);
        try {
          const loginRes = await api.post('/auth/login', { email, password });
          const token = loginRes.data.data.token;
          localStorage.setItem('token', token);

          const getMeRes = await api.get('/user-management/user-me');
          const userData = JSON.stringify(getMeRes.data.data);
          localStorage.setItem('user', userData);

          onLoginSuccess();
        } catch (err) {
          console.error(err);
          alert('Erro ao realizar login.');
        } finally {
          setLoading(false);
        }
      };
  
    return (
      <div className="min-h-screen bg-owl-background flex items-center justify-center px-4">
        <div className="bg-owl-surface shadow-2xl rounded-xl p-8 w-full max-w-md border border-owl-primary">
          
          <div className="flex flex-col items-center mb-6">
            <img src="../../icons/logo.jpeg" className="w-12 h-12 mb-3" />
            <Typography variant="h4" className="font-display font-bold text-owl-text">
              Login
            </Typography>          
          </div>
    
          <form className="space-y-4">
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#94A3B8' } }}
              InputProps={{ style: { color: '#F1F5F9' } }}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#94A3B8' } }}
              InputProps={{ style: { color: '#F1F5F9' } }}
            />
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleLogin}
              sx={{
                mt: 1,
                background: 'linear-gradient(to right, #3B82F6, #2563EB)',
                '&:hover': {
                  background: 'linear-gradient(to right, #2563EB, #1D4ED8)',
                },
                fontWeight: 600,
                py: 1.3,
                borderRadius: 2,
                letterSpacing: 0.5,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
                </form>
            <Typography variant="body2" className="text-owl-secondaryText mt-1 text-center" style={{ marginTop: '1rem' }}>
                Ainda não tem uma conta?{' '}
            <a
                href="/register"
                className="over:underline"
                style={{ color: '#3B82F6', fontWeight: 'bold' }}
            >
                Cadastre-se
            </a>
            </Typography>
        </div>
      </div>
    );
  }

function onLoginSuccess() {
    throw new Error('Function not implemented.');
}

