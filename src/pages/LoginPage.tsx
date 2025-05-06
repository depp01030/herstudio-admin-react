import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { loginWithCredentials } from '@/api/authApi';
import { ROUTES } from '@/config/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth); // ✅ 改為取得 setAuth

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // ✅ 接收 accessToken + role
      const { accessToken, role } = await loginWithCredentials(username, password);

      // ✅ 存入 store 並寫入 localStorage
      setAuth(accessToken, role);

      navigate(ROUTES.PRODUCTS);
    } catch (err: any) {
      setErrorMsg(err?.message || '登入失敗，請確認帳密');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h5" mb={3}>
          登入系統
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="帳號"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
          />

          <TextField
            label="密碼"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '登入中...' : '登入'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
