import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import MenuBar from '../../components/MenuBar';
import axios from 'axios';
import '../../styles/RestaurantHours.css';

export default function RestaurantHours() {
    const [hours, setHours] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [restaurantId, setRestaurantId] = useState(null);
    const [selectedHours, setSelectedHours] = useState({
        day_of_week: '',
        open_time: null,
        close_time: null
    });

    const daysOfWeek = [
        { label: 'Segunda-feira', value: 'segunda' },
        { label: 'Terça-feira', value: 'terca' },
        { label: 'Quarta-feira', value: 'quarta' },
        { label: 'Quinta-feira', value: 'quinta' },
        { label: 'Sexta-feira', value: 'sexta' },
        { label: 'Sábado', value: 'sabado' },
        { label: 'Domingo', value: 'domingo' }
    ];

    useEffect(() => {
        fetchRestaurantAndHours();
    }, []);

    const fetchRestaurantAndHours = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para acessar esta página');
                return;
            }

            const restaurantResponse = await axios.get('http://localhost:8000/api/restaurants/restaurants/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (restaurantResponse.data.length > 0) {
                const restId = restaurantResponse.data[0].id;
                setRestaurantId(restId);

                const hoursResponse = await axios.get(`http://localhost:8000/api/restaurants/restaurants/${restId}/operating_hours/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setHours(hoursResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error);
            if (error.response?.status === 401) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                // Add navigation to login if needed
            } else {
                alert('Erro ao carregar dados. Por favor, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();

        if (!selectedHours.day_of_week || !selectedHours.open_time || !selectedHours.close_time) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para realizar esta ação');
                return;
            }

            const formatTimeString = (date) => {
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            };

            const formattedData = {
                restaurant: restaurantId,
                day_of_week: selectedHours.day_of_week, // Using the value directly from dropdown
                open_time: formatTimeString(selectedHours.open_time),
                close_time: formatTimeString(selectedHours.close_time)
            };

            console.log('Sending data:', formattedData);

            await axios.post(
                `http://localhost:8000/api/restaurants/restaurants/${restaurantId}/operating_hours/`,
                formattedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Horário salvo com sucesso!");
            setVisible(false);
            fetchRestaurantAndHours();
            setSelectedHours({ day_of_week: '', open_time: null, close_time: null });
        } catch (error) {
            console.error("Erro ao salvar horários:", error.response?.data || error.message);
            alert('Erro ao salvar horários: ' + JSON.stringify(error.response?.data || error.message));
        }
    };

    const deleteHours = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este horário?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/api/restaurants/restaurants/${restaurantId}/operating_hours/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchRestaurantAndHours();
            } catch (error) {
                console.error('Error deleting hours:', error);
                alert('Erro ao excluir horário');
            }
        }
    };

    const formatTime = (time) => {
        return time ? time.substring(0, 5) : '';
    };

    const getDayName = (dayValue) => {
        return daysOfWeek.find(day => day.value === dayValue)?.label || '';
    };

    const handleEdit = (rowData) => {
        setSelectedHours({
            day_of_week: rowData.day_of_week,
            open_time: new Date(`2000-01-01T${rowData.open_time}`),
            close_time: new Date(`2000-01-01T${rowData.close_time}`)
        });
        setVisible(true);
    };

    return (
        <div>
            <MenuBar />
            <div className="hours-container">
                <Card>
                    <div className="hours-header">
                        <h2>Horários de Funcionamento</h2>
                        <Button
                            label="Adicionar Horário"
                            icon="pi pi-plus"
                            onClick={() => setVisible(true)}
                        />
                    </div>

                    <DataTable
                        value={hours}
                        loading={loading}
                        breakpoint="960px"
                        emptyMessage="Nenhum horário cadastrado"
                        size="small"
                        scrollable
                        scrollHeight="400px"
                        className="p-datatable-centered"
                    >
                        <Column
                            field="day_of_week"
                            header="Dia da Semana"
                            body={(rowData) => getDayName(rowData.day_of_week)}
                            style={{ textAlign: 'center' }}
                            headerStyle={{ textAlign: 'center' }}
                        />
                        <Column
                            field="open_time"
                            header="Horário de Abertura"
                            body={(rowData) => formatTime(rowData.open_time)}
                            style={{ textAlign: 'center' }}
                            headerStyle={{ textAlign: 'center' }}
                        />
                        <Column
                            field="close_time"
                            header="Horário de Fechamento"
                            body={(rowData) => formatTime(rowData.close_time)}
                            style={{ textAlign: 'center' }}
                            headerStyle={{ textAlign: 'center' }}
                        />
                        <Column
                            field="actions"
                            header="Ações"
                            style={{ width: '6rem', textAlign: 'center' }}
                            headerStyle={{ textAlign: 'center' }}
                            bodyStyle={{ textAlign: 'center', padding: '0.5rem' }}
                            body={(rowData) => (
                                <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', width: '100%' }}>
                                    <Button
                                        type="button"
                                        icon="pi pi-pencil"
                                        className="p-button-text p-button-sm"
                                        onClick={() => handleEdit(rowData)}
                                    />
                                    <Button
                                        type="button"
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-sm p-button-danger"
                                        onClick={() => deleteHours(rowData.id)}
                                    />
                                </div>
                            )}
                        />
                    </DataTable>
                </Card>

                <Dialog
                    visible={visible}
                    onHide={() => setVisible(false)}
                    header="Adicionar Horário de Funcionamento"
                    className="p-fluid"
                    style={{ width: '90vw', maxWidth: '500px' }}
                    breakpoints={{ '960px': '75vw', '640px': '100vw' }}
                    contentStyle={{ padding: '2rem' }}
                >
                    <div className="hours-form">
                        <div className="form-group">
                            <label>Dia da Semana</label>
                            <Dropdown
                                value={selectedHours.day_of_week}
                                options={daysOfWeek}
                                onChange={(e) => setSelectedHours({ ...selectedHours, day_of_week: e.value })}
                                placeholder="Selecione o dia"
                                className="w-full"
                            />
                        </div>
                        <div className="form-group">
                            <label>Horário de Abertura</label>
                            <Calendar
                                value={selectedHours.open_time}
                                onChange={(e) => setSelectedHours({ ...selectedHours, open_time: e.value })}
                                timeOnly
                                hourFormat="24"
                                className="w-full"
                            />
                        </div>
                        <div className="form-group">
                            <label>Horário de Fechamento</label>
                            <Calendar
                                value={selectedHours.close_time}
                                onChange={(e) => setSelectedHours({ ...selectedHours, close_time: e.value })}
                                timeOnly
                                hourFormat="24"
                            />
                        </div>
                        <Button label="Salvar" onClick={handleSubmit} />
                    </div>
                </Dialog>
            </div>
        </div>
    );
}