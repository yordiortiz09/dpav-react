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
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RegisterForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    telefono: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "" }); 
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nombre":
        if (!value.trim()) error = "El nombre es obligatorio.";
        break;
      case "apellido_paterno":
        if (!value.trim()) error = "El apellido paterno es obligatorio.";
        break;
      case "telefono":
        if (!/^\d{10}$/.test(value))
          error = "El teléfono debe tener exactamente 10 dígitos.";
        break;
      case "email":
        if (
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value.trim())
        )
          error = "El correo no tiene un formato válido.";
        break;
      case "password":
        if (value.length < 8)
          error = "La contraseña debe tener al menos 8 caracteres.";
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

  const handleKeyDown = (e) => {
    if (
      !(
        (e.key >= "0" && e.key <= "9") || 
        e.key === "Backspace" || 
        e.key === "ArrowLeft" || 
        e.key === "ArrowRight" || 
        e.key === "Tab" 
      )
    ) {
      e.preventDefault();
    }
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
      const response = await api.post("/registrar", form);
      setSnackbar({
        open: true,
        message: "Usuario registrado correctamente.",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login"); 
      }, 2000);
    } catch (error) {
      let errorMessage = "Error al registrar el usuario.";
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === "object") {
          errorMessage = Object.entries(errorData)
            .map(([field, messages]) => ` ${messages.join(", ")}`)
            .join(" | ");
        } else {
          errorMessage = errorData;
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registro de Usuario
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre}
          />
          <TextField
            label="Apellido Paterno"
            name="apellido_paterno"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            error={Boolean(errors.apellido_paterno)}
            helperText={errors.apellido_paterno}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            fullWidth
            margin="normal"
            variant="outlined"
            type="tel"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={Boolean(errors.telefono)}
            helperText={errors.telefono}
          />
          <TextField
            label="Correo Electrónico"
            name="email"
            fullWidth
            margin="normal"
            variant="outlined"
            type="email"
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            label="Contraseña"
            name="password"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }} />
        <Box textAlign="center">
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
            >
              Inicia Sesión
            </Link>
          </Typography>
        </Box>
      </Paper>

    
    

      {/* Snackbar para mostrar mensajes */}
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

export default RegisterForm;
