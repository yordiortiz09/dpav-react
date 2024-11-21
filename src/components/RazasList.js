import React, { useState, useEffect } from "react";
import { fetchRazas, updateRaza } from "../services/api";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "./Navbar";

const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const RazasList = () => {
  const [razas, setRazas] = useState([]);
  const [filteredRazas, setFilteredRazas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const razasData = await fetchRazas();
      setRazas(razasData);
      setFilteredRazas(razasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = razas.filter((raza) =>
      raza.nombre.toLowerCase().includes(term)
    );

    setFilteredRazas(filtered);
  };

  const handleUpdate = async (id) => {
    const nuevoNombre = prompt("Ingrese el nuevo nombre de la raza:");
    if (!nuevoNombre) return;

    try {
      await updateRaza(id, { nombre: nuevoNombre });
      fetchData();
    } catch (err) {
      setError("Error al actualizar la raza");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <NavBar />
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "20px auto",
          p: 4,
          backgroundColor: "#ffffff", // Fondo blanco completo
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Sombras suaves
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: "#333" }}>
          Razas
        </Typography>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            mb: 4,
            
          }}
        />
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 3 }}>
          {filteredRazas.length > 0 ? (
            <List>
              {filteredRazas.map((raza) => (
                <ListItem
                  key={raza.id}
                  divider
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "#f1f1f1", // Color al pasar el mouse
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
                        {highlightText(raza.nombre, searchTerm)}
                      </Typography>
                    }
                    secondaryTypographyProps={{
                      sx: { fontSize: "14px", color: "#666" },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleUpdate(raza.id)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography align="center" sx={{ p: 2, fontSize: "16px", color: "#999" }}>
              No se encontraron razas que coincidan con la búsqueda.
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default RazasList;
