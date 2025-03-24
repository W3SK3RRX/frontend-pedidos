import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import MenuBar from '../../components/MenuBar';
import '../../styles/MenuManagement.css';
import axios from 'axios';

export default function MenuManagement() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [displayCategoryDialog, setDisplayCategoryDialog] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCategories();
        fetchProducts();
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/restaurants/menu-categories/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(response.data.map(category => ({ label: category.name, value: category.id })));
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/restaurants/menu-items/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Erro ao buscar itens do menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (product) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este item?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => deleteProduct(product)
        });
    };

    const actionBodyTemplate = (rowData) => (
        <div className="action-buttons">
            <Button icon="pi pi-pencil" className="p-button-success" onClick={() => editProduct(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDelete(rowData)} />
        </div>
    );

    const editProduct = (product) => {
        setSelectedProduct({ ...product, category: product.category.id });
        setDisplayDialog(true);
    };

    const saveProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = {
                name: selectedProduct.name,
                description: selectedProduct.description,
                category_id: selectedProduct.category,
                price: selectedProduct.price,
                available: selectedProduct.available
            };

            if (selectedProduct.id) {
                await axios.put(
                    `http://localhost:8000/api/restaurants/menu-items/${selectedProduct.id}/`,
                    data,
                    { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
                );
            } else {
                await axios.post(
                    'http://localhost:8000/api/restaurants/menu-items/',
                    data,
                    { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
                );
            }

            fetchProducts();
            hideDialog();
            alert(selectedProduct.id ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar item do menu:', error);
            alert('Erro ao salvar o item. Por favor, tente novamente.');
        }
    };

    const deleteProduct = async (product) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:8000/api/restaurants/menu-items/${product.id}/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setProducts(products.filter(p => p.id !== product.id));
            alert('Item excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir item do menu:', error);
            alert('Erro ao excluir o item. Por favor, tente novamente.');
        }
    };

    const saveCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:8000/api/restaurants/categories/',
                { name: newCategory },
                { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            setDisplayCategoryDialog(false);
            setNewCategory('');
            fetchCategories();
            alert('Categoria criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            alert('Erro ao criar categoria. Por favor, tente novamente.');
        }
    };

    const hideDialog = () => {
        setDisplayDialog(false);
        setSelectedProduct(null);
    };

    return (
        <div>
            <MenuBar />
            <ConfirmDialog />
            <div className="menu-management-container">
                <div className="header">
                    <h1>Gerenciamento do Cardápio</h1>
                    <div className="header-buttons">
                        <Button 
                            label="Nova Categoria" 
                            icon="pi pi-plus" 
                            className="p-button-sm p-button-secondary" 
                        />
                        <Button 
                            label="Novo Item" 
                            icon="pi pi-plus" 
                            className="p-button-sm" 
                        />
                    </div>
                </div>

                <Dialog visible={displayCategoryDialog} style={{ width: '450px' }} header="Nova Categoria" modal onHide={() => setDisplayCategoryDialog(false)}>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="categoryName">Nome da Categoria</label>
                            <InputText id="categoryName" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <Button label="Salvar" icon="pi pi-check" onClick={saveCategory} />
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setDisplayCategoryDialog(false)} />
                    </div>
                </Dialog>

                <DataTable value={products} loading={loading} responsiveLayout="scroll" paginator rows={10} className="menu-table">
                    <Column field="name" header="Nome" sortable />
                    <Column field="category.name" header="Categoria" sortable />
                    <Column field="price" header="Preço" body={(rowData) => `R$ ${rowData.price.toFixed(2)}`} sortable />
                    <Column field="description" header="Descrição" />
                    <Column field="available" header="Status" body={(rowData) => rowData.available ? 'Ativo' : 'Inativo'} />
                    <Column body={actionBodyTemplate} header="Ações" style={{ width: '6rem' }} />
                </DataTable>
            </div>
        </div>
    );
}
