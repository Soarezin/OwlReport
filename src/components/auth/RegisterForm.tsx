import { useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleRegister = async () => {
      setLoading(true);
      try {
        const registerRes = await api.post('/auth/register', {
          name,
          email,
          password,
        });
  
        const token = registerRes.data.data.token;
        localStorage.setItem('token', token);
        navigate('/');

      } catch (err) {
        console.error(err);
        alert('Erro ao registrar ou criar projeto.');
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
              Vamos começar?
            </Typography>
            <Typography variant="body2" className="text-owl-secondaryText mt-1 text-center">
              Crie sua Conta e Empresa ou Equipe.
            </Typography>
          </div>
    
          <form className="space-y-4">
            <TextField
              label="Seu Nome"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: '#94A3B8' } }}
              InputProps={{ style: { color: '#F1F5F9' } }}
            />
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
            <TextField
              label="Nome da sua empresa ou equipe"
              fullWidth
              variant="outlined"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              InputLabelProps={{ style: { color: '#94A3B8' } }}
              InputProps={{ style: { color: '#F1F5F9' } }}
            />
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handleRegister}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Continuar'}
            </Button>
          </form>
        </div>
      </div>
    );
  }
