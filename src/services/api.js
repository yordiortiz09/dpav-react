import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', 
});

export const fetchPerros = async (token) => {
    try {
        const response = await api.get('/perros', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data.perros;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al cargar los perros');
    }
};

export const deletePerro = async (id, token) => {
    await api.delete(`/eliminarPerro/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createPerro = async (data, token) => {
    await api.post('/crearPerro', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const updatePerro = async (id, data, token) => {
    await api.put(`/actualizarPerro/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const fetchRazas = async (token) => {
    const response = await api.get('/razas', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
 
    return response.data;
};

export const updateRaza = async (id, data, token) => {
    await api.put(`/actualizarRaza/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createRaza = async (data, token) => {
    await api.post('/crearRaza', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};






export default api;
