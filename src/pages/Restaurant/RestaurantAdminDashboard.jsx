import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaStore, FaClipboardList, FaChartLine, FaClock } from 'react-icons/fa';
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

        // Verifica se o usuário tem restaurante cadastrado
        axios.get('http://localhost:8000/api/restaurants/my-restaurants/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (response.data.length > 0) {
                    setHasRestaurant(true);
                    setRestaurantStatus(response.data[0].status);
                } else {
                    setHasRestaurant(false);
                }
            })
            .catch(error => {
                console.error("Erro ao verificar restaurante:", error);
                setHasRestaurant(false);
            });
    }, [navigate]);


    const statusColors = {
        "ativo": "#28a745",
        "pendente": "#ffc107",
        "rejeitado": "#dc3545"
    };

    const cardData = [
        {
            title: 'Página do restaurante',
            description: 'Atualize informações e imagens da página do restaurante.',
            icon: <FaStore className="dashboard-icon" />,
            path: '/restaurant/profile'
        },
        {
            title: 'Gerenciar Cardápio',
            description: 'Adicione, edite ou remova itens do menu do seu restaurante.',
            icon: <FaUtensils className="dashboard-icon" />,
            path: '/restaurant/menu'
        },
        {
            title: 'Gerenciar Pedidos',
            description: 'Veja e atualize o status dos pedidos recebidos.',
            icon: <FaClipboardList className="dashboard-icon" />,
            path: '/admin/pedidos'
        },
        {
            title: 'Horários de Funcionamento',
            description: 'Configure os horários de funcionamento do seu restaurante.',
            icon: <FaClock className="dashboard-icon" />,
            path: '/restaurant/hours'
        },
        {
            title: 'Faturamento',
            description: 'Visualize métricas e relatórios financeiros.',
            icon: <FaChartLine className="dashboard-icon" />,
            path: '/admin/dashboard'
        }
    ];
    
    const isRestaurantActive = hasRestaurant && restaurantStatus === "ativo";

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
                        <>
                            <div className="status-indicator" style={{ backgroundColor: statusColors[restaurantStatus] }}>
                                {restaurantStatus.charAt(0).toUpperCase() + restaurantStatus.slice(1)}
                            </div>
                            {restaurantStatus === "pendente" && (
                                <div className="pending-message">
                                    Seu restaurante está em análise. Aguarde a aprovação para acessar todas as funcionalidades.
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="dashboard-grid">
                    {cardData.map((card, index) => (
                        <Card key={index} className={`dashboard-card ${!isRestaurantActive ? 'disabled-card' : ''}`}>
                            <div className="card-content">
                                {card.icon}
                                <h2>{card.title}</h2>
                                <p>{card.description}</p>
                                <Button
                                    label="Acessar"
                                    icon="pi pi-arrow-right"
                                    className="p-button-rounded p-button-primary"
                                    onClick={() => navigate(card.path)}
                                    disabled={!isRestaurantActive}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}