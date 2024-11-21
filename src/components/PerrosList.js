import React, { useState, useEffect } from 'react';
import { fetchPerros, deletePerro } from '../services/api'; 
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    TextField,
    Button,
} from '@mui/material';
import NavBar from './Navbar';

const PerrosList = () => {
    const [perros, setPerros] = useState([]);
    const [filteredPerros, setFilteredPerros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token'); 
            const perrosData = await fetchPerros(token);
            setPerros(perrosData);
            setFilteredPerros(perrosData);
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
                (perro.raza?.nombre || '').toLowerCase().includes(term)
        );

        setFilteredPerros(filtered);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await deletePerro(id, token); 
            fetchData(); 
        } catch (err) {
            setError('Error al eliminar el perro');
        }
    };

    const handleEdit = (id) => {
        
        window.alert(`Editar perro con ID: ${id}`);
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
            <Box sx={{ maxWidth: '600px', margin: '0 auto', p: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Lista de Perros
                </Typography>
                <TextField
                    label="Buscar por nombre o raza"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <List>
                    {filteredPerros.map((perro) => (
                        <ListItem key={perro.id} divider>
                            <ListItemText
                                primary={`${perro.nombre} (${perro.raza?.nombre || 'Sin raza'})`}
                                secondary={`Color: ${perro.color} | Edad: ${perro.edad} años | Sexo: ${perro.sexo}`}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => handleEdit(perro.id)}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(perro.id)}
                            >
                                Eliminar
                            </Button>
                        </ListItem>
                    ))}
                </List>
                {filteredPerros.length === 0 && (
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
                        No se encontraron perros que coincidan con la búsqueda.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default PerrosList;
