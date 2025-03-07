import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

const login = async (username, password) => {
    const response = await api.post("/users/login/", { username, password });

    // Salvar token e papel do usuário no localStorage
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("role", response.data.role);

    return response.data;
};

const register = async (userData) => {
    const response = await api.post('/users/register/', userData);
    return response.data;
};

export default {
    register,
    login,
};
