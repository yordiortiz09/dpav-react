import React, { useState, useEffect } from 'react';
import { fetchRazas, updateRaza } from '../services/api';
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
    Paper,
} from '@mui/material';
import NavBar from './Navbar';

const RazasList = () => {
    const [razas, setRazas] = useState([]);
    const [filteredRazas, setFilteredRazas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
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
        const nuevoNombre = prompt('Ingrese el nuevo nombre de la raza:');
        if (!nuevoNombre) return;

        try {
            await updateRaza(id, { nombre: nuevoNombre });
            fetchData(); 
        } catch (err) {
            setError('Error al actualizar la raza');
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
                    maxWidth: '800px',
                    margin: '20px auto',
                    p: 2,
                }}
            >
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                    Lista de Razas
                </Typography>
                <TextField
                    label="Buscar por nombre"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ mb: 3 }}
                />
                <Paper elevation={3} sx={{ p: 2 }}>
                    {filteredRazas.length > 0 ? (
                        <List>
                            {filteredRazas.map((raza) => (
                                <ListItem
                                    key={raza.id}
                                    divider
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ListItemText
                                        primary={raza.nombre}
                                        primaryTypographyProps={{
                                            variant: 'h6',
                                            sx: { color: '#333' },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleUpdate(raza.id)}
                                    >
                                        Editar
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography
                            variant="body1"
                            align="center"
                            color="textSecondary"
                        >
                            No se encontraron razas que coincidan con la búsqueda.
                        </Typography>
                    )}
                </Paper>
            </Box>
        </>
    );
};

export default RazasList;
