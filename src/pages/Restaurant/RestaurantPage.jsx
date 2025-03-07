import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import { Image } from "primereact/image";
import { Badge } from "primereact/badge";
import { Rating } from "primereact/rating";
import { useNavigate } from "react-router-dom";
import "../../styles/RestaurantPage.css";

const RestaurantPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(0);
    const [value, setValue] = useState(4);
    const [cart, setCart] = useState([]);

    const restaurant = {
        name: "Pizzaria Sabor & Arte",
        description: "Deliciosas pizzas artesanais com ingredientes frescos.",
        rating: 4.5,
        deliveryTime: "30-45 min",
        deliveryFee: "R$ 5,00",
        banner: "https://cdn.venngage.com/template/thumbnail/full/791abf07-b184-4abf-95ff-24dde10ff633.webp",
        categories: [
            { label: "Pizzas", value: "pizzas", icon: "pi pi-circle-fill" },
            { label: "Bebidas", value: "bebidas", icon: "pi pi-circle-fill" },
            { label: "Sobremesas", value: "sobremesas", icon: "pi pi-circle-fill" }
        ],
        menu: {
            pizzas: [
                { name: "Pizza de Calabresa", description: "Calabresa, queijo e orégano", price: "R$ 39,90", image: "https://static.vecteezy.com/ti/fotos-gratis/t2/38706013-ai-gerado-leve-embora-ou-entrega-pizza-caixa-profissional-publicidade-comidagrafia-foto.jpg" },
                { name: "Pizza de Frango com Catupiry", description: "Frango desfiado e catupiry", price: "R$ 44,90", image: "https://static.vecteezy.com/ti/fotos-gratis/t2/38706013-ai-gerado-leve-embora-ou-entrega-pizza-caixa-profissional-publicidade-comidagrafia-foto.jpg" }
            ],
            bebidas: [
                { name: "Refrigerante 2L", description: "Coca-Cola, Guaraná e Fanta", price: "R$ 9,90", image: "https://www.davo.com.br/ccstore/v1/images/?source=/file/v6417944964120382135/products/prod_7891991001342.imagem1.jpg&height=300&width=300" },
                { name: "Suco Natural", description: "Laranja, uva e maracujá", price: "R$ 12,90", image: "https://cantinagoodlanche.com.br/wp-content/uploads/2020/07/beneficios-dos-sucos-naturais-1-alfa-hotel-600x429.jpg" }
            ],
            sobremesas: [
                { name: "Pudim", description: "Pudim de leite condensado", price: "R$ 14,90", image: "https://static.itdg.com.br/images/640-440/d1307a2e17cda187df76b78cfd3ac464/shutterstock-2322251819-1-.jpg" },
                { name: "Torta de Chocolate", description: "Chocolate belga e chantilly", price: "R$ 18,90", image: "https://minhasreceitinhas.com.br/wp-content/uploads/2024/05/torta-de-chocolate-belga.jpg" }
            ]
        }
    };

    // Add to cart function
    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    // Add removeFromCart function
    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    return (
        <div className="restaurant-page">
            <div className="banner-container">
                <div className="banner">
                    <img src={restaurant.banner} alt="Banner do Restaurante" className="banner-img" />
                </div>
            </div>

            <div className="content-container">
                <div className="restaurant-info">
                    <div className="info-header">
                        <h1>{restaurant.name}</h1>
                        <div className="restaurant-stats">
                            <Rating value={value} readOnly stars={5} cancel={false} />
                            <Badge value={restaurant.rating} severity="success" className="rating-badge" />
                        </div>
                    </div>
                    <p className="description">{restaurant.description}</p>
                    <div className="delivery-info">
                        <span><i className="pi pi-clock"></i> {restaurant.deliveryTime}</span>
                        <span><i className="pi pi-car"></i> {restaurant.deliveryFee}</span>
                    </div>
                </div>

                <div className="menu-container">
                    <TabMenu
                        model={restaurant.categories.map((category, index) => ({
                            label: category.label,
                            icon: category.icon,
                            command: () => setActiveCategory(index)
                        }))}
                        activeIndex={activeCategory}
                        className="custom-tabmenu"
                    />

                    <div className="menu-grid">
                        {restaurant.menu[restaurant.categories[activeCategory].value].map((item, index) => (
                            <div key={index} className="menu-item">
                                <div className="item-image">
                                    <Image src={item.image} alt={item.name} preview />
                                </div>
                                <div className="item-content">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>

                                    <div className="item-footer">
                                        <strong>{item.price}</strong>
                                        <Button
                                            label="Adicionar"
                                            icon="pi pi-shopping-cart"
                                            className="p-button"
                                            onClick={() => addToCart(item)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Button */}
            <div className="cart-button-container">
                <Button
                    icon="pi pi-shopping-cart"
                    className="p-button-rounded p-button-lg"
                    onClick={() => navigate('/cart')}
                    badge={cart.length.toString()}
                    badgeClassName="p-badge-danger"
                />
            </div>

        </div>
    );
};

export default RestaurantPage;
