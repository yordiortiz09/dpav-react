import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  Snackbar,
  Alert,
  Link
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "" }); 
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "El correo electrónico es obligatorio.";
        } else if (
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
        ) {
          error = "El correo no tiene un formato válido.";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "La contraseña es obligatoria.";
        } else if (value.length < 8) {
          error = "La contraseña debe tener al menos 8 caracteres.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => validateField(key, form[key]));

    if (Object.values(errors).some((error) => error)) {
      setSnackbar({
        open: true,
        message: "Por favor corrige los errores antes de continuar.",
        type: "error",
      });
      return;
    }

    setLoading(true); 
    try {
      const response = await api.post("/login", form);
      setSnackbar({
        open: true,
        message: "Inicio de sesión exitoso.",
        type: "success",
      });
      setTimeout(() => {
        navigate("/dashboard"); 
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Usuario o contraseña incorrectos.",
        type: "error",
      });
    } finally {
      setLoading(false); 
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inicio de Sesión
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            name="email"
            fullWidth
            margin="normal"
            type="email"
            variant="outlined"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            label="Contraseña"
            name="password"
            fullWidth
            margin="normal"
            type="password"
            variant="outlined"
            value={form.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
          </Button>
        </form>
        <Divider sx={{ my: 2 }} />
        <Box textAlign="center">
          <Typography variant="body2">
            ¿No tienes una cuenta?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')} 
            >
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>

      {}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
