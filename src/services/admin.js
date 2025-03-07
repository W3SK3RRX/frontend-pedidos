import axios from "axios";

const API_URL = "http://localhost:8000/api/admin/restaurants";

const getRestaurants = () => axios.get(API_URL);
const approveRestaurant = (id) => axios.post(`${API_URL}/${id}/approve`);
const blockRestaurant = (id) => axios.post(`${API_URL}/${id}/block`);

const getAuditLogs = () => axios.get("http://localhost:8000/api/admin/audit-logs");

const getUsers = () => axios.get("http://localhost:8000/api/admin/users");
const blockUser = (id) => axios.post(`http://localhost:8000/api/admin/users/${id}/block`);
const reset2FA = (id) => axios.post(`http://localhost:8000/api/admin/users/${id}/reset-2fa`);

const getAdminStats = () => axios.get("http://localhost:8000/api/admin/stats");

const getPendingRestaurants = () => axios.get("http://localhost:8000/api/admin/restaurants/pending");

export default { 
    getRestaurants,
    approveRestaurant,
    blockRestaurant,
    getAuditLogs,
    getUsers,
    blockUser,
    reset2FA,
    getAdminStats,
    getPendingRestaurants
};
