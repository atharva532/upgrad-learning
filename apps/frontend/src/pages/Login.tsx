import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { OtpForm } from '../components/OtpForm';

type LoginState = 'email' | 'otp';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function Login() {
  const [loginState, setLoginState] = useState<LoginState>('email');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as LocationState)?.from?.pathname || '/home';

  const handleOtpSent = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setLoginState('otp');
  };

  const handleAuthSuccess = (data: {
    user: { id: string; email: string };
    accessToken: string;
    isNewUser: boolean;
  }) => {
    login(data.accessToken, data.user, data.isNewUser);
    navigate(from, { replace: true });
  };

  const handleBack = () => {
    setEmail('');
    setLoginState('email');
  };

  if (loginState === 'otp') {
    return <OtpForm email={email} onSuccess={handleAuthSuccess} onBack={handleBack} />;
  }

  return <AuthForm onOtpSent={handleOtpSent} />;
}
