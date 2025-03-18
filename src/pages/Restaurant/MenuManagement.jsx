import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import MenuBar from '../../components/MenuBar';
import '../../styles/MenuManagement.css';

export default function MenuManagement() {
    const [products, setProducts] = useState([
        { id: 1, name: 'X-Burger', category: 'Hamburgers', price: 25.90, description: 'Delicious burger with cheese', active: true },
        { id: 2, name: 'French Fries', category: 'Side Dishes', price: 12.90, description: 'Crispy potato fries', active: true },
    ]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const categories = [
        { label: 'Hamburgers', value: 'Hamburgers' },
        { label: 'Side Dishes', value: 'Side Dishes' },
        { label: 'Beverages', value: 'Beverages' },
        { label: 'Desserts', value: 'Desserts' }
    ];

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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Button icon="pi pi-pencil" className="p-button-success"
                    onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-danger"
                    onClick={() => confirmDelete(rowData)} />
            </div>
        );
    };

    const editProduct = (product) => {
        setSelectedProduct({ ...product });
        setDisplayDialog(true);
    };

    const deleteProduct = (product) => {
        setProducts(products.filter(p => p.id !== product.id));
    };

    const hideDialog = () => {
        setDisplayDialog(false);
        setSelectedProduct(null);
    };

    const saveProduct = () => {
        if (selectedProduct.id) {
            setProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
        } else {
            setProducts([...products, { ...selectedProduct, id: products.length + 1 }]);
        }
        hideDialog();
    };

    // Update selection state to single item
    const [selectedProducts, setSelectedProducts] = useState(null);

    const editSelected = () => {
        if (selectedProducts) {
            editProduct(selectedProducts);
        }
    };

    const deleteSelected = () => {
        setProducts(products.filter(p => !selectedProducts.includes(p)));
        setSelectedProducts([]);
    };

    return (
        <div>
            <MenuBar />
            <div className="menu-management-container">
                <div className="header">
                    <h1>Gerenciamento do Cardápio</h1>
                    <Button label="Novo Item" icon="pi pi-plus" className="p-button-sm"
                        onClick={() => setDisplayDialog(true)} />
                </div>

                <DataTable value={products}
                    selection={selectedProducts}
                    onSelectionChange={e => setSelectedProducts(e.value)}
                    responsiveLayout="scroll"
                    paginator rows={10}
                    className="menu-table"
                    
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} itens">
                    <Column selectionMode="single" style={{ width: '3rem' }} />
                    <Column field="name" header="Nome" sortable />
                    <Column field="category" header="Categoria" sortable />
                    <Column field="price" header="Preço" body={(rowData) => `R$ ${rowData.price.toFixed(2)}`} sortable />
                    <Column field="description" header="Descrição" />
                    <Column field="active" header="Status"
                        body={(rowData) => rowData.active ? 'Ativo' : 'Inativo'} />

                    <Column body={actionBodyTemplate} header="Ações"
                        style={{ width: '6rem' }} />
                </DataTable>

                <Dialog visible={displayDialog} style={{ width: '450px' }}
                    header="Detalhes do Produto" modal onHide={hideDialog}>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={selectedProduct?.name || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="category">Categoria</label>
                            <Dropdown id="category" options={categories} value={selectedProduct?.category}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Preço</label>
                            <InputNumber id="price" value={selectedProduct?.price} mode="currency" currency="BRL"
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={selectedProduct?.description || ''}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="status" 
                                options={[
                                    { label: 'Ativo', value: true },
                                    { label: 'Inativo', value: false }
                                ]}
                                value={selectedProduct?.active}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, active: e.value })} />
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <Button label="Salvar" icon="pi pi-check" onClick={saveProduct} />
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={hideDialog} />
                    </div>
                </Dialog>
            </div>
        </div>
    );
}