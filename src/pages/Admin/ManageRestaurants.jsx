import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/admin";
//import "../../styles/Admin.css";

const ManageRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchRestaurants();
    }, [navigate]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getRestaurants();
            setRestaurants(response.data);
        } catch (error) {
            console.error("Erro ao buscar restaurantes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.approveRestaurant(id);
            fetchRestaurants(); // Atualiza a lista após aprovação
        } catch (error) {
            console.error("Erro ao aprovar restaurante:", error);
        }
    };

    const handleBlock = async (id) => {
        try {
            await api.blockRestaurant(id);
            fetchRestaurants(); // Atualiza a lista após bloqueio
        } catch (error) {
            console.error("Erro ao bloquear restaurante:", error);
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                {rowData.status === "Pendente" && (
                    <Button label="Aprovar" icon="pi pi-check" className="p-button-success" onClick={() => handleApprove(rowData.id)} />
                )}
                {rowData.status !== "Bloqueado" && (
                    <Button label="Bloquear" icon="pi pi-ban" className="p-button-danger" onClick={() => handleBlock(rowData.id)} />
                )}
            </div>
        );
    };

    return (
        <div className="admin-container">
            <h2>Gerenciamento de Restaurantes</h2>
            <DataTable 
                value={restaurants} 
                paginator 
                rows={5} 
                loading={loading}
                className="p-datatable-striped"
                emptyMessage="Nenhum restaurante encontrado">
                <Column field="name" header="Nome" sortable />
                <Column field="owner" header="Dono" sortable />
                <Column field="created_at" header="Data de Criação" sortable />
                <Column field="status" header="Status" sortable />
                <Column body={actionTemplate} header="Ações" />
            </DataTable>
        </div>
    );
};

export default ManageRestaurants;
