import { useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import '../../styles/CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
            return total + price;
        }, 0);
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <Button 
                        icon="pi pi-arrow-left" 
                        className="p-button-text"
                        onClick={() => navigate(-1)}
                        tooltip="Voltar ao cardápio"
                    />
                    <h1>Seu Carrinho</h1>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <i className="pi pi-shopping-cart" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                        <p>Seu carrinho está vazio</p>
                        <Button 
                            label="Voltar para o Cardápio" 
                            icon="pi pi-arrow-left"
                            onClick={() => navigate(-1)}
                            className="p-button-outlined"
                        />
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="cart-item-content">
                                        <h3>{item.name}</h3>
                                        <p>{item.price}</p>
                                    </div>
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-danger p-button-text"
                                        onClick={() => removeFromCart(index)}
                                        tooltip="Remover item"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="cart-footer">
                            <div className="cart-total">
                                Total: <span>R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
                            </div>
                            <Button
                                label="Finalizar Pedido"
                                icon="pi pi-check"
                                className="p-button-success p-button-lg"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;