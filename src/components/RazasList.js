import React, { useState, useEffect } from "react";
import { fetchRazas, updateRaza, createRaza } from "../services/api";
import {
  Box,
  Typography,
  TextField,
  Alert,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "./Navbar";

const RazasList = () => {
  const [razas, setRazas] = useState([]);
  const [filteredRazas, setFilteredRazas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRaza, setSelectedRaza] = useState(null);
  const [newRazaName, setNewRazaName] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const razasData = await fetchRazas();
      setRazas(razasData);
      setFilteredRazas(razasData);
    } catch (err) {
      setError("Error al cargar las razas");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "nombre" && (!value || value.trim().length === 0)) {
      error = "El nombre de la raza es obligatorio.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = razas.filter((raza) =>
      raza.nombre.toLowerCase().includes(term)
    );

    setFilteredRazas(filtered);
  };

  const handleCreateChange = (e) => {
    const { value } = e.target;
    setNewRazaName(value);
    validateField("nombre", value);
  };

  const handleEditChange = (e) => {
    const { value } = e.target;
    setNewRazaName(value);
    validateField("nombre", value);
  };

  const handleCreate = async () => {
    if (!newRazaName.trim()) {
      setSnackbar({ open: true, message: "El nombre de la raza es obligatorio", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await createRaza({ nombre: newRazaName });
      setSnackbar({ open: true, message: "Raza creada correctamente", type: "success" });
      setOpenCreateModal(false);
      setNewRazaName("");
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: "Error al crear la raza", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!newRazaName.trim()) {
      setSnackbar({ open: true, message: "El nombre de la raza es obligatorio", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await updateRaza(selectedRaza.id, { nombre: newRazaName });
      setSnackbar({ open: true, message: "Raza actualizada correctamente", type: "success" });
      setOpenEditModal(false);
      setSelectedRaza(null);
      setNewRazaName("");
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: "Error al actualizar la raza", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (raza) => {
    setSelectedRaza(raza);
    setNewRazaName(raza.nombre);
    setOpenEditModal(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", type: "" });
  };

  const isCreateDisabled = !newRazaName.trim() || errors.nombre;
  const isEditDisabled = !newRazaName.trim() || errors.nombre;

  return (
    <>
      <NavBar />
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "20px auto",
          p: 4,
          backgroundColor: "#ffffff",
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 0, color: "#333" }}>
            Razas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateModal(true)}
          >
            Agregar Raza
          </Button>
        </Box>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 4 }}
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
                      backgroundColor: "#f1f1f1",
                    },
                  }}
                >
                  <ListItemText
                    primary={raza.nombre}
                    secondaryTypographyProps={{
                      sx: { fontSize: "14px", color: "#666" },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(raza)}
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

      {}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Agregar Nueva Raza</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Raza"
            variant="outlined"
            fullWidth
            value={newRazaName}
            onChange={handleCreateChange}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)} color="error">
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            color="primary"
            variant="contained"
            disabled={isCreateDisabled || loading}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Raza</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Raza"
            variant="outlined"
            fullWidth
            value={newRazaName}
            onChange={handleEditChange}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="error">
            Cancelar
          </Button>
          <Button
            onClick={handleEdit}
            color="primary"
            variant="contained"
            disabled={isEditDisabled || loading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default RazasList;
