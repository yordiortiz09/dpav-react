import React, { useState, useEffect } from "react";
import { fetchPerros, deletePerro, updatePerro, createPerro, fetchRazas } from "../services/api";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
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

const PerrosList = () => {
  const [perros, setPerros] = useState([]);
  const [razas, setRazas] = useState([]);
  const [filteredPerros, setFilteredPerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "" });

  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedPerro, setSelectedPerro] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [newPerroData, setNewPerroData] = useState({});
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const perrosData = await fetchPerros(token);
      const razasData = await fetchRazas();
      setPerros(perrosData);
      setFilteredPerros(perrosData);
      setRazas(razasData);
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
    const filtered = perros.filter(
      (perro) =>
        perro.nombre.toLowerCase().includes(term) ||
        (perro.raza?.nombre || "").toLowerCase().includes(term)
    );
    setFilteredPerros(filtered);
  };

  const validateField = (name, value) => {
    let error = "";
  
    switch (name) {
      case "nombre":
      case "color":
        if (!value.trim()) error = `El ${name} es obligatorio.`;
        break;
      case "edad":
      case "peso":
      case "altura":
        if (!value || isNaN(value) || value <= 0) error = `El ${name} debe ser un número positivo.`;
        break;
      case "sexo":
        if (!["Macho", "Hembra"].includes(value)) error = "El sexo es obligatorio.";
        break;
      case "tamaño":
        if (!["Pequeño", "Mediano", "Grande"].includes(value)) error = "El tamaño es obligatorio.";
        break;
      case "id_raza":
        if (!value) error = "La raza es obligatoria.";
        break;
      case "fecha_nacimiento":
        if (!value) error = "La fecha de nacimiento es obligatoria.";
        break;
      case "esterilizado":
        if (!["Si", "No"].includes(value)) error = "El estado de esterilización es obligatorio.";
        break;
      default:
        break;
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  
  const handleChangeCreate = (e) => {
    const { name, value } = e.target;
    setNewPerroData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };
  
  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };
  

  const isCreateDisabled = Object.values(errors).some((error) => error) || 
                         !newPerroData.nombre || 
                         !newPerroData.color || 
                         !newPerroData.edad || 
                         !newPerroData.sexo || 
                         !newPerroData.peso || 
                         !newPerroData.tamaño || 
                         !newPerroData.altura || 
                         !newPerroData.esterilizado || 
                         !newPerroData.id_raza || 
                         !newPerroData.fecha_nacimiento;

const isEditDisabled = Object.values(errors).some((error) => error) || 
                       !updatedData.nombre || 
                       !updatedData.color || 
                       !updatedData.edad || 
                       !updatedData.sexo || 
                       !updatedData.peso || 
                       !updatedData.tamaño || 
                       !updatedData.altura || 
                       !updatedData.esterilizado || 
                       !updatedData.id_raza || 
                       !updatedData.fecha_nacimiento;


  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await updatePerro(selectedPerro.id, updatedData, token);
      setSnackbar({ open: true, message: "Perro actualizado correctamente", type: "success" });
      setOpenEdit(false);
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: "Error al actualizar el perro", type: "error" });
      console.error(err);
      console.error(err.response?.data); 

    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      await createPerro(newPerroData, token);
  
      setSnackbar({ open: true, message: "Perro creado correctamente", type: "success" });
  
      setOpenCreate(false);
  
      setNewPerroData({}); 
  
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: "Error al crear el perro", type: "error" });
      console.error(err);
      console.error(err.response?.data);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deletePerro(id, token);
      setSnackbar({ open: true, message: "Perro eliminado correctamente", type: "success" });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: "Error al eliminar el perro", type: "error" });
        console.error(err); 
        console.error(err.response?.data);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", type: "" });
  };

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
          <Typography variant="h4" color="primary">
            Lista de Perros
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Crear Perro
          </Button>
        </Box>
        <TextField
          label="Buscar por nombre o raza"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Paper elevation={3} sx={{ mt: 3 }}>
          {filteredPerros.length > 0 ? (
            <List>
              {filteredPerros.map((perro) => (
                <ListItem
                  key={perro.id}
                  divider
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <ListItemText
                    primary={highlightText(perro.nombre, searchTerm)}
                    secondary={`Color: ${perro.color} | Edad: ${perro.edad} años`}
                  />
                  <Box>
                  <IconButton
  color="primary"
  onClick={() => {
    setSelectedPerro(perro); // Establece el perro seleccionado
    setUpdatedData({
      nombre: perro.nombre,
      color: perro.color,
      edad: perro.edad,
      sexo: perro.sexo,
      peso: perro.peso,
      tamaño: perro.tamaño,
      altura: perro.altura,
      esterilizado: perro.esterilizado,
      id_raza: perro.raza?.id || "",
      fecha_nacimiento: perro.fecha_nacimiento,
    }); // Carga los datos actuales en el estado updatedData
    setOpenEdit(true); // Abre el modal
  }}
>
  <EditIcon />
</IconButton>
                    <IconButton color="error" onClick={() => handleDelete(perro.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 3 }}>No se encontraron perros.</Typography>
          )}
        </Paper>
      </Box>

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
 {/* Modal para Crear Perro */}
 <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
    <DialogTitle>Crear Nuevo Perro</DialogTitle>
    <DialogContent>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={newPerroData.nombre || ""}
          onChange={handleChangeCreate}
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
          fullWidth
        />
        <TextField
          label="Color"
          name="color"
          value={newPerroData.color || ""}
          onChange={handleChangeCreate}
          error={Boolean(errors.color)}
          helperText={errors.color}
          fullWidth
        />
        <TextField
          label="Edad (años)"
          name="edad"
          value={newPerroData.edad || ""}
          onChange={handleChangeCreate}
          error={Boolean(errors.edad)}
          helperText={errors.edad}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(errors.sexo)}>
          <InputLabel>Sexo</InputLabel>
          <Select
            name="sexo"
            value={newPerroData.sexo || ""}
            onChange={handleChangeCreate}
          >
            <MenuItem value="Macho">Macho</MenuItem>
            <MenuItem value="Hembra">Hembra</MenuItem>
          </Select>
          <FormHelperText>{errors.sexo}</FormHelperText>
        </FormControl>
        <TextField
          label="Peso (kg)"
          name="peso"
          value={newPerroData.peso || ""}
          onChange={handleChangeCreate}
          error={Boolean(errors.peso)}
          helperText={errors.peso}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(errors.tamaño)}>
          <InputLabel>Tamaño</InputLabel>
          <Select
            name="tamaño"
            value={newPerroData.tamaño || ""}
            onChange={handleChangeCreate}
          >
            <MenuItem value="Pequeño">Pequeño</MenuItem>
            <MenuItem value="Mediano">Mediano</MenuItem>
            <MenuItem value="Grande">Grande</MenuItem>
          </Select>
          <FormHelperText>{errors.tamaño}</FormHelperText>
        </FormControl>
        <TextField
          label="Altura (cm)"
          name="altura"
          value={newPerroData.altura || ""}
          onChange={handleChangeCreate}
          error={Boolean(errors.altura)}
          helperText={errors.altura}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(errors.esterilizado)}>
          <InputLabel>Esterilizado</InputLabel>
          <Select
            name="esterilizado"
            value={newPerroData.esterilizado || ""}
            onChange={handleChangeCreate}
          >
            <MenuItem value="Si">Sí</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
          <FormHelperText>{errors.esterilizado}</FormHelperText>
        </FormControl>
        <FormControl fullWidth error={Boolean(errors.id_raza)}>
          <InputLabel>Raza</InputLabel>
          <Select
            name="id_raza"
            value={newPerroData.id_raza || ""}
            onChange={handleChangeCreate}
          >
            {razas.map((raza) => (
              <MenuItem key={raza.id} value={raza.id}>
                {raza.nombre}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.id_raza}</FormHelperText>
        </FormControl>
        <TextField
          label="Fecha de Nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={newPerroData.fecha_nacimiento || ""}
          onChange={handleChangeCreate}
          error={Boolean(errors.fecha_nacimiento)}
          helperText={errors.fecha_nacimiento}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </DialogContent>
    <DialogActions>
  <Button onClick={() => setOpenCreate(false)} color="error">
    Cancelar
  </Button>
  <Button
    onClick={handleCreate}
    color="primary"
    variant="contained"
    disabled={isCreateDisabled}
  >
    Crear
  </Button>
</DialogActions>

  </Dialog>

  {/* Modal para Editar Perro */}
  <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
    <DialogTitle>Editar Perro</DialogTitle>
    <DialogContent>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={updatedData.nombre || ""}
          onChange={handleChangeEdit}
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
          fullWidth
        />
        <TextField
          label="Color"
          name="color"
          value={updatedData.color || ""}
          onChange={handleChangeEdit}
          error={Boolean(errors.color)}
          helperText={errors.color}
          fullWidth
        />
        <TextField
          label="Edad (años)"
          name="edad"
          value={updatedData.edad || ""}
          onChange={handleChangeEdit}
          error={Boolean(errors.edad)}
          helperText={errors.edad}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(errors.sexo)}>
          <InputLabel>Sexo</InputLabel>
          <Select
            name="sexo"
            value={updatedData.sexo || ""}
            onChange={handleChangeEdit}
          >
            <MenuItem value="Macho">Macho</MenuItem>
            <MenuItem value="Hembra">Hembra</MenuItem>
          </Select>
          <FormHelperText>{errors.sexo}</FormHelperText>
        </FormControl>
        <TextField
          label="Peso (kg)"
          name="peso"
          value={updatedData.peso || ""}
          onChange={handleChangeEdit}
          error={Boolean(errors.peso)}
          helperText={errors.peso}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(errors.tamaño)}>
          <InputLabel>Tamaño</InputLabel>
          <Select
            name="tamaño"
            value={updatedData.tamaño || ""}
            onChange={handleChangeEdit}
          >
            <MenuItem value="Pequeño">Pequeño</MenuItem>
            <MenuItem value="Mediano">Mediano</MenuItem>
            <MenuItem value="Grande">Grande</MenuItem>
          </Select>
          <FormHelperText>{errors.tamaño}</FormHelperText>
        </FormControl>
        <TextField
          label="Altura (cm)"
          name="altura"
          value={updatedData.altura || ""}
          onChange={handleChangeEdit}
          error={Boolean(errors.altura)}
          helperText={errors.altura}
          fullWidth
        />
        <FormControl fullWidth error={Boolean(errors.esterilizado)}>
          <InputLabel>Esterilizado</InputLabel>
          <Select
            name="esterilizado"
            value={updatedData.esterilizado || ""}
            onChange={handleChangeEdit}
          >
            <MenuItem value="Si">Sí</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
          <FormHelperText>{errors.esterilizado}</FormHelperText>
        </FormControl>
        <FormControl fullWidth error={Boolean(errors.id_raza)}>
          <InputLabel>Raza</InputLabel>
          <Select
            name="id_raza"
            value={updatedData.id_raza || ""}
            onChange={handleChangeEdit}
          >
            {razas.map((raza) => (
              <MenuItem key={raza.id} value={raza.id}>
                {raza.nombre}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.id_raza}</FormHelperText>
        </FormControl>
        <TextField
          label="Fecha de Nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={updatedData.fecha_nacimiento || ""}
          onChange={handleChangeEdit}
          error={Boolean(errors.fecha_nacimiento)}
          helperText={errors.fecha_nacimiento}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </DialogContent>
    <DialogActions>
  <Button onClick={() => setOpenEdit(false)} color="error">
    Cancelar
  </Button>
  <Button
    onClick={handleUpdate}
    color="primary"
    variant="contained"
    disabled={isEditDisabled}
  >
    Guardar
  </Button>
</DialogActions>

  </Dialog>
</>
  );
};

export default PerrosList;
