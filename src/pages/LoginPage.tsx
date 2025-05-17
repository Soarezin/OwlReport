import { useNavigate } from "react-router-dom";
import LoginForm from '../components/auth/LoginForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();

  return (
    <LoginForm onLoginSuccess={() => navigate("/")} />
  );
}