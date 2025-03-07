import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import api from "../../services/admin";
//import "../../styles/Admin.css";

const ManageRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await api.getRestaurants();
            setRestaurants(response.data);
        } catch (error) {
            console.error("Erro ao buscar restaurantes:", error);
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
            <DataTable value={restaurants} paginator rows={5} className="p-datatable-striped">
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
