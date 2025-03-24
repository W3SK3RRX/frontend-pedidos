import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import MenuBar from '../../components/MenuBar';
import axios from 'axios';
import '../../styles/RestaurantProfile.css';

export default function RestaurantProfile() {
    const [restaurant, setRestaurant] = useState({
        name: '',
        description: '',
        category: '',
        phone: '',
        address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            cep: ''
        },
        image: null
    });
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // Combine both data fetching operations into a single useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página');
                    return;
                }

                // Fetch categories
                const categoriesResponse = await axios.get('http://localhost:8000/api/restaurants/restaurant-categories/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const formattedCategories = categoriesResponse.data.map(category => ({
                    label: category.name,
                    value: category.id
                }));
                setCategories(formattedCategories);

                // Fetch restaurant data
                const restaurantResponse = await axios.get('http://localhost:8000/api/restaurants/restaurants/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // In the fetchData function, update how we set the restaurant data
                if (restaurantResponse.data.length > 0) {
                    const restaurantData = restaurantResponse.data[0];
                    setRestaurant({
                        ...restaurantData,
                        // If category exists, use its ID, otherwise use empty string
                        category: restaurantData.category ? restaurantData.category : '',
                        address: restaurantData.address || {
                            street: '',
                            number: '',
                            neighborhood: '',
                            city: '',
                            cep: ''
                        }
                    });
                    if (restaurantData.image) {
                        setPreviewImage(restaurantData.image);
                    }
                }

                // Update handleSubmit data object
                const data = {
                    name: restaurant.name,
                    description: restaurant.description,
                    category_id: restaurant.category, // Change to category_id to match API
                    phone: restaurant.phone,
                    address: {
                        street: restaurant.address.street,
                        number: restaurant.address.number,
                        neighborhood: restaurant.address.neighborhood,
                        city: restaurant.address.city,
                        cep: restaurant.address.cep
                    }
                };
            } catch (error) {
                console.error('Erro ao carregar dados:', error.response?.data || error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Remove the second useEffect that was causing the error


    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Você precisa estar logado para acessar esta página');
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/restaurants/restaurants/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data.length > 0) {
                    setRestaurant(response.data[0]);
                    if (response.data[0].image) {
                        setPreviewImage(response.data[0].image);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados do restaurante:', error.response?.data || error);
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, []);

    const handleChange = (e, field, isAddress = false) => {
        if (isAddress) {
            setRestaurant(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: e.target.value
                }
            }));
        } else {
            setRestaurant(prev => ({
                ...prev,
                [field]: e.target.value
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.files[0];
        setRestaurant(prev => ({ ...prev, image: file }));
        setPreviewImage(URL.createObjectURL(file));
    };

    // Add new state for validation
    const [errors, setErrors] = useState({});

    // Add validation function
    const validateForm = () => {
        const newErrors = {};
        
        // Basic info validation
        if (!restaurant.name?.trim()) newErrors.name = 'Nome é obrigatório';
        if (!restaurant.category) newErrors.category = 'Categoria é obrigatória';
        if (!restaurant.phone?.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!restaurant.description?.trim()) newErrors.description = 'Descrição é obrigatória';
        
        // Address validation
        if (!restaurant.address.cep?.trim()) newErrors['address.cep'] = 'CEP é obrigatório';
        if (!restaurant.address.city?.trim()) newErrors['address.city'] = 'Cidade é obrigatória';
        if (!restaurant.address.neighborhood?.trim()) newErrors['address.neighborhood'] = 'Bairro é obrigatório';
        if (!restaurant.address.street?.trim()) newErrors['address.street'] = 'Rua é obrigatória';
        if (!restaurant.address.number?.trim()) newErrors['address.number'] = 'Número é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update handleSubmit to include validation
    const handleSubmit = async () => {
        if (!validateForm()) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para realizar esta ação');
                return;
            }

            // Create data object instead of FormData
            const data = {
                name: restaurant.name,
                description: restaurant.description,
                category_id: restaurant.category, // Changed from category to category_id
                phone: restaurant.phone,
                address: {
                    street: restaurant.address.street,
                    number: restaurant.address.number,
                    neighborhood: restaurant.address.neighborhood,
                    city: restaurant.address.city,
                    cep: restaurant.address.cep
                }
            };

            // If there's a new image, use FormData
            if (restaurant.image instanceof File) {
                const formData = new FormData();
                formData.append('image', restaurant.image);
                
                // First, update the image separately
                await axios.patch(
                    `http://localhost:8000/api/restaurants/restaurants/${restaurant.id}/`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            // Then update the rest of the data
            await axios.put(
                `http://localhost:8000/api/restaurants/restaurants/${restaurant.id}/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Restaurante atualizado com sucesso!');
        } catch (error) {
            if (error.response?.status === 403) {
                alert('Você não tem permissão para editar este restaurante');
            } else {
                console.error('Erro ao atualizar restaurante:', error.response?.data || error);
                alert('Erro ao atualizar restaurante. Tente novamente.');
            }
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <MenuBar />
            <div className="profile-container">
                <Card className="profile-card">
                    <h2>Informações do Restaurante</h2>
                    
                    <div className="form-section">
                        <div className="form-group">
                            <label>Nome do Restaurante *</label>
                            <InputText
                                value={restaurant.name}
                                onChange={(e) => handleChange(e, 'name')}
                                className={errors.name ? 'p-invalid' : ''}
                            />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label>Categoria *</label>
                            <Dropdown
                                value={restaurant.category}
                                options={categories}
                                onChange={(e) => handleChange(e, 'category')}
                                className={errors.category ? 'p-invalid' : ''}
                            />
                            {errors.category && <small className="p-error">{errors.category}</small>}
                        </div>

                        <div className="form-group">
                            <label>Telefone</label>
                            <InputMask
                                mask="(99) 99999-9999"
                                value={restaurant.phone}
                                onChange={(e) => handleChange(e, 'phone')}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Descrição</label>
                            <InputTextarea
                                value={restaurant.description}
                                onChange={(e) => handleChange(e, 'description')}
                                rows={3}
                            />
                        </div>

                        <div className="address-section">
                            <h3>Endereço</h3>
                            <div className="form-group">
                                <label>CEP *</label>
                                <InputMask
                                    mask="99999-999"
                                    value={restaurant.address.cep}
                                    onChange={(e) => handleChange(e, 'cep', true)}
                                    className={errors['address.cep'] ? 'p-invalid' : ''}
                                />
                                {errors['address.cep'] && <small className="p-error">{errors['address.cep']}</small>}
                            </div>
                            <div className="form-group">
                                <label>Cidade</label>
                                <InputText
                                    value={restaurant.address.city}
                                    onChange={(e) => handleChange(e, 'city', true)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Bairro</label>
                                <InputText
                                    value={restaurant.address.neighborhood}
                                    onChange={(e) => handleChange(e, 'neighborhood', true)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Rua</label>
                                <InputText
                                    value={restaurant.address.street}
                                    onChange={(e) => handleChange(e, 'street', true)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Número</label>
                                <InputText
                                    value={restaurant.address.number}
                                    onChange={(e) => handleChange(e, 'number', true)}
                                />
                            </div>
                        </div>

                        <div className="image-section">
                            <h3>Imagem do Restaurante</h3>
                            {previewImage && (
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="preview-image"
                                />
                            )}
                            <FileUpload
                                mode="basic"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={handleImageUpload}
                                chooseLabel="Escolher Nova Imagem"
                            />
                        </div>

                        <div className="button-section">
                            <Button
                                label="Salvar Alterações"
                                icon="pi pi-check"
                                className="p-button-success"
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}