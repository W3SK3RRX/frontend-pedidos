import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const MenuBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const items = [
        {
            label: 'Início',
            icon: 'pi pi-home',
            command: () => navigate('/admin/dashboard')
        },
        {
            label: 'Pedidos',
            icon: 'pi pi-list',
            command: () => navigate('/admin/pedidos')
        }
    ];

    const end = (
        <Button 
            label="Sair" 
            icon="pi pi-sign-out" 
            className="p-button-danger p-button-text"
            onClick={handleLogout}
        />
    );

    return (
        <div className="card">
            <Menubar 
                model={items} 
                end={end}
                className="border-none shadow-1"
            />
        </div>
    );
};

export default MenuBar;