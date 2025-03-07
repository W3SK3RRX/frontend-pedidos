import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import api from "../../services/admin";
//import "../../styles/Admin.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ orders: 0, users: 0, restaurants: 0 });
    const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.getAdminStats();
            setStats(response.data.stats);
            setRevenueData({
                labels: response.data.revenue.labels,
                datasets: [
                    {
                        label: "Faturamento (R$)",
                        data: response.data.revenue.values,
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                    }
                ]
            });
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Dashboard do Administrador</h2>
            <div className="stats-container">
                <Card title="Pedidos" className="stat-card">{stats.orders}</Card>
                <Card title="Usuários Ativos" className="stat-card">{stats.users}</Card>
                <Card title="Restaurantes" className="stat-card">{stats.restaurants}</Card>
            </div>
            <div className="chart-container">
                <h3>Faturamento</h3>
                <Chart type="bar" data={revenueData} />
            </div>
        </div>
    );
};

export default AdminDashboard;
