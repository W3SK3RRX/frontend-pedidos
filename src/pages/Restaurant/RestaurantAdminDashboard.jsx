import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaStore, FaClipboardList, FaChartLine } from 'react-icons/fa';
import MenuBar from '../../components/MenuBar';
import axios from 'axios';
import '../../styles/RestaurantAdminDashboard.css';

export default function RestaurantAdminDashboard() {
    const navigate = useNavigate();
    const [hasRestaurant, setHasRestaurant] = useState(false);
    const [restaurantStatus, setRestaurantStatus] = useState("pendente");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Check if user has a restaurant
        axios.get('http://localhost:8000/api/restaurants/my-restaurants/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setHasRestaurant(response.data.length > 0);
            if (response.data.length > 0) {
                setRestaurantStatus(response.data[0].status);
            }
        })
        .catch(error => {
            console.error("Erro ao verificar restaurante:", error);
            setHasRestaurant(false);
        });
    }, [navigate]);

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
                    <div className="header-content">
                        <h1 className="dashboard-title">Painel Administrativo</h1>
                        {!hasRestaurant && (
                            <Button 
                                label="Cadastrar Restaurante" 
                                icon="pi pi-plus"
                                className="p-button-success p-button-sm" 
                                onClick={() => navigate('/restaurant/create')}
                            />
                        )}
                    </div>
                    {hasRestaurant && (
                        <div className="status-indicator" style={{ backgroundColor: statusColors[restaurantStatus] }}>
                            {restaurantStatus.charAt(0).toUpperCase() + restaurantStatus.slice(1)}
                        </div>
                    )}
                </div>
                
                <div className="dashboard-grid">
                    {cardData.map((card, index) => (
                        <Card key={index} className={`dashboard-card ${!hasRestaurant ? 'disabled-card' : ''}`}>
                            <div className="card-content">
                                {card.icon}
                                <h2>{card.title}</h2>
                                <p>{card.description}</p>
                                <Button 
                                    label="Acessar" 
                                    icon="pi pi-arrow-right"
                                    className="p-button-rounded p-button-primary" 
                                    onClick={() => navigate(card.path)}
                                    disabled={!hasRestaurant}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}