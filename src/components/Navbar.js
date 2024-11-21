
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    DPAV
                </Typography>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Button color="inherit" component={Link} to="/perros">
                        Perros
                    </Button>
                    <Button color="inherit" component={Link} to="/razas">
                        Razas
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
