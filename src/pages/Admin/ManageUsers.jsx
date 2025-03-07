import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import axios from "axios";
import MenuBar from "../../components/MenuBar";
import "../../styles/ManageUsers.css";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert("Erro ao carregar os usuários. Tente novamente mais tarde.");
            }
        }
        
    };

    const status2faBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.is_2fa_enabled ? "Ativo" : "Desativado"}
                severity={rowData.is_2fa_enabled ? "success" : "danger"}
            />
        );
    };

    const roleBodyTemplate = (rowData) => {
        const roleLabels = {
            'ADMIN': 'Administrador',
            'RESTAURANT_OWNER': 'Dono de Restaurante',
            'CUSTOMER': 'Cliente'
        };
        
        return (
            <Tag 
                value={roleLabels[rowData.role] || rowData.role}
                severity={rowData.role === 'ADMIN' ? 'info' : 'warning'}
            />
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Button 
                    label={rowData.is_active ? "Bloquear" : "Desbloquear"} 
                    icon={`pi ${rowData.is_active ? 'pi-lock' : 'pi-lock-open'}`}
                    className={`p-button-sm ${rowData.is_active ? 'p-button-danger' : 'p-button-success'}`}
                    onClick={() => handleBlock(rowData.id)} 
                />
            </div>
        );
    };

    return (
        <div>
            <MenuBar />
            <div className="admin-container">
                <div className="users-header">
                    <h2>Gerenciamento de Usuários</h2>
                    <span className="user-count">Total: {users.length} usuários</span>
                </div>
                <DataTable 
                    value={users} 
                    paginator 
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    className="p-datatable-users"
                    emptyMessage="Nenhum usuário encontrado"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column field="username" header="Usuário" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="phone" header="Telefone" sortable />
                    <Column field="role" header="Tipo" body={roleBodyTemplate} sortable />
                    <Column field="is_2fa_enabled" header="2fa" body={status2faBodyTemplate} sortable />
                    <Column body={actionTemplate} header="Ações" style={{ width: '150px' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default ManageUsers;
