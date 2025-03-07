import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import axios from "axios";
import MenuBar from "../../components/MenuBar";
//import "../../styles/ManageLogs.css";

const ManageLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/users/logs/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLogs(response.data);
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert("Erro ao carregar os logs. Tente novamente mais tarde.");
            }
        }
    };

    const statusCodeBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.status_code} 
                severity={rowData.status_code >= 400 ? "danger" : "success"} 
            />
        );
    };

    return (
        <div>
            <MenuBar />
            <div className="admin-container">
                <div className="logs-header">
                    <h2>Logs de Acesso</h2>
                    <span className="logs-count">Total: {logs.length} logs</span>
                </div>
                <DataTable 
                    value={logs} 
                    paginator 
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    className="p-datatable-logs"
                    emptyMessage="Nenhum log encontrado"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} logs"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column field="user" header="Usuário" sortable />
                    <Column field="ip_address" header="Endereço IP" sortable />
                    <Column field="endpoint" header="Endpoint" sortable />
                    <Column field="method" header="Método" sortable />
                    <Column body={statusCodeBodyTemplate} header="Código de Status" sortable />
                    <Column field="timestamp" header="Data e Hora" sortable />
                </DataTable>
            </div>
        </div>
    );
};

export default ManageLogs;
