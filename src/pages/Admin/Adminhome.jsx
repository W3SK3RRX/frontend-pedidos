import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import MenuBar from '../../components/MenuBar';
import '../../styles/AdminHome.css';

const AdminHome = () => {
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState(0);

    // Add authentication check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Configure axios with token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        axios.get("http://localhost:8000/admin/pending-notifications/", {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
            .then(response => setPendingRequests(response.data.pending_requests))
            .catch(error => {
                console.error("Erro ao buscar notificações:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            });
    }, [navigate]);

    const sections = [
        { 
            title: "Dashboard", 
            path: "/admin/dashboard", 
            icon: "pi pi-chart-line",
            description: "Visualize métricas e estatísticas do sistema"
        },
        { 
            title: "Gerenciar Usuários", 
            path: "/admin/manage-users", 
            icon: "pi pi-users",
            description: "Gerencie contas e permissões de usuários"
        },
        { 
            title: "Gerenciar Restaurantes", 
            path: "/admin/manage-restaurants", 
            icon: "pi pi-building",
            badge: pendingRequests > 0 ? pendingRequests : null,
            description: "Administre cadastros e solicitações de restaurantes"
        },
        { 
            title: "Auditoria", 
            path: "/admin/audit-logs", 
            icon: "pi pi-search",
            description: "Acompanhe logs e atividades do sistema"
        },
    ];

    return (
        <div>
            <MenuBar />
            <div className="admin-home">
                <div className="admin-header">
                    <h1>Painel Administrativo</h1>
                    <p>Bem-vindo ao painel de controle administrativo</p>
                </div>
                
                <div className="admin-grid">
                    {sections.map((section, index) => (
                        <Card 
                            key={index} 
                            className="admin-card" 
                            onClick={() => navigate(section.path)}
                        >
                            <div className="card-content">
                                <div className="icon-wrapper">
                                    <i className={section.icon}></i>
                                    {section.badge && (
                                        <Badge 
                                            value={section.badge} 
                                            severity="danger" 
                                            className="notification-badge"
                                        />
                                    )}
                                </div>
                                <h2>{section.title}</h2>
                                <p>{section.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
