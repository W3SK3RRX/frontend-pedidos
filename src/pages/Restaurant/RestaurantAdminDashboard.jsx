import { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaStore, FaClipboardList, FaChartLine } from 'react-icons/fa';
import MenuBar from '../../components/MenuBar';
import axios from 'axios';
import '../../styles/RestaurantAdminDashboard.css';

export default function RestaurantAdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Configure axios with token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // You can add an API call here to verify restaurant owner status
        // and fetch restaurant status if needed
    }, [navigate]);

    // Mock do status do restaurante (pode ser alterado quando integrado com API)
    const restaurantStatus = "Aguardando aprovação";
    
    const statusColors = {
        "Ativo": "#28a745",
        "Aguardando aprovação": "#ffc107",
        "Suspenso": "#dc3545"
    };

    const cardData = [
        {
            title: 'Gerenciar Cardápio',
            description: 'Adicione, edite ou remova itens do menu do seu restaurante.',
            icon: <FaUtensils className="dashboard-icon" />,
            path: '/admin/cardapio'
        },
        {
            title: 'Alterar Página',
            description: 'Atualize informações e imagens da página do restaurante.',
            icon: <FaStore className="dashboard-icon" />,
            path: '/admin/restaurante'
        },
        {
            title: 'Gerenciar Pedidos',
            description: 'Veja e atualize o status dos pedidos recebidos.',
            icon: <FaClipboardList className="dashboard-icon" />,
            path: '/admin/pedidos'
        },
        {
            title: 'Faturamento',
            description: 'Visualize métricas e relatórios financeiros.',
            icon: <FaChartLine className="dashboard-icon" />,
            path: '/admin/dashboard'
        }
    ];

    return (
        <div>
            <MenuBar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Painel Administrativo do Restaurante</h1>
                    <div className="status-indicator" style={{ backgroundColor: statusColors[restaurantStatus] }}>
                        {restaurantStatus}
                    </div>
                </div>
                
                <div className="dashboard-grid">
                    {cardData.map((card, index) => (
                        <Card key={index} className="dashboard-card">
                            <div className="card-content">
                                {card.icon}
                                <h2>{card.title}</h2>
                                <p>{card.description}</p>
                                <Button 
                                    label="Acessar" 
                                    icon="pi pi-arrow-right"
                                    className="p-button-rounded p-button-primary" 
                                    onClick={() => navigate(card.path)}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}