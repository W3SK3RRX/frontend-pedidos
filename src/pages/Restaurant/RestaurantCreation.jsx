import React, { useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import '../../styles/RestaurantCreation.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RestaurantCreation() {
    const navigate = useNavigate();
    const stepperRef = useRef(null);
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        description: "",
        category: "",
        cep: "",
        city: "",
        neighborhood: "",
        street: "",
        number: "",
        phone: "",
        image: null
    });

    const categories = [
        { label: 'Fast Food', value: 'fast_food' },
        { label: 'Italiana', value: 'italiana' },
        { label: 'Japonesa', value: 'japonesa' },
        { label: 'Brasileira', value: 'brasileira' },
        { label: 'Árabe', value: 'arabe' }
    ];

    const handleChange = (e, field) => {
        setRestaurantData({ ...restaurantData, [field]: e.target.value });
    };

    const handleFileUpload = (e) => {
        setRestaurantData({ ...restaurantData, image: e.files[0] });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Create the request data object matching the serializer structure
            const requestData = {
                name: restaurantData.name,
                description: restaurantData.description,
                category: restaurantData.category,
                phone: restaurantData.phone.replace(/\D/g, ''), // Remove non-digits from phone
                address: {
                    cep: restaurantData.cep.replace(/\D/g, ''), // Remove non-digits from CEP
                    city: restaurantData.city,
                    neighborhood: restaurantData.neighborhood,
                    street: restaurantData.street,
                    number: restaurantData.number
                }
            };

            // Create FormData
            const formData = new FormData();
            
            // Add each field individually to FormData
            Object.keys(requestData).forEach(key => {
                if (key === 'address') {
                    Object.keys(requestData.address).forEach(addressKey => {
                        formData.append(`address.${addressKey}`, requestData.address[addressKey]);
                    });
                } else {
                    formData.append(key, requestData[key]);
                }
            });
            
            if (restaurantData.image) {
                formData.append('image', restaurantData.image);
            }

            const response = await axios.post('http://localhost:8000/api/restaurants/create/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("✅ Restaurante cadastrado com sucesso", response.data);
            navigate('/restaurant/dashboard');
        } catch (error) {
            console.error('❌ Erro ao cadastrar restaurante:', error.response ? error.response.data : error);
        }
    };

    // Update the last StepperPanel's button to use handleSubmit
    return (
        <div className="restaurant-creation-container">
            <div className="stepper-container">
                <h1 className="creation-title">Cadastro de Restaurante</h1>
                <Stepper ref={stepperRef}>
                    <StepperPanel header="Informações Básicas">
                        <div className="form-section">
                            <div className="form-field full-width">
                                <label>Nome do Restaurante</label>
                                <InputText
                                    value={restaurantData.name}
                                    onChange={(e) => handleChange(e, "name")}
                                    placeholder="Digite o nome do restaurante"
                                />
                            </div>
                            <div className="form-field">
                                <label>Categoria</label>
                                <Dropdown
                                    value={restaurantData.category}
                                    options={categories}
                                    onChange={(e) => handleChange(e, "category")}
                                    placeholder="Selecione uma categoria"
                                />
                            </div>
                            <div className="form-field">
                                <label>Telefone</label>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={restaurantData.phone}
                                    onChange={(e) => handleChange(e, "phone")}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div className="form-field full-width">
                                <label>Descrição</label>
                                <InputTextarea
                                    value={restaurantData.description}
                                    onChange={(e) => handleChange(e, "description")}
                                    rows={3}
                                    placeholder="Descreva seu restaurante"
                                />
                            </div>
                        </div>
                        <div className="button-container">
                            <div></div>
                            <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </StepperPanel>

                    <StepperPanel header="Endereço">
                        <div className="form-section">
                            <div className="form-field">
                                <label>CEP</label>
                                <InputMask
                                    mask="99999-999"
                                    value={restaurantData.cep}
                                    onChange={(e) => handleChange(e, "cep")}
                                    placeholder="00000-000"
                                />
                            </div>
                            <div className="form-field">
                                <label>Cidade</label>
                                <InputText
                                    value={restaurantData.city}
                                    onChange={(e) => handleChange(e, "city")}
                                    placeholder="Digite a cidade"
                                />
                            </div>
                            <div className="form-field">
                                <label>Bairro</label>
                                <InputText
                                    value={restaurantData.neighborhood}
                                    onChange={(e) => handleChange(e, "neighborhood")}
                                    placeholder="Digite o bairro"
                                />
                            </div>
                            <div className="form-field">
                                <label>Rua</label>
                                <InputText
                                    value={restaurantData.street}
                                    onChange={(e) => handleChange(e, "street")}
                                    placeholder="Digite a rua"
                                />
                            </div>
                            <div className="form-field">
                                <label>Número</label>
                                <InputText
                                    value={restaurantData.number}
                                    onChange={(e) => handleChange(e, "number")}
                                    placeholder="Nº"
                                />
                            </div>
                        </div>
                        <div className="button-container">
                            <Button label="Voltar" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            <Button label="Próximo" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                        </div>
                    </StepperPanel>

                    <StepperPanel header="Imagem e Categoria">
                        <div className="form-section">
                            <div className="form-field full-width">
                                <label>Imagem do Restaurante</label>
                                <div className="file-upload-container">
                                    <FileUpload
                                        mode="basic"
                                        name="demo[]"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        onSelect={handleFileUpload}
                                        chooseLabel="Escolher Imagem"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="button-container">
                            <Button
                                label="Voltar"
                                severity="secondary"
                                icon="pi pi-arrow-left"
                                onClick={() => stepperRef.current.prevCallback()}
                            />
                            <Button
                                label="Finalizar"
                                icon="pi pi-check"
                                severity="success"
                                onClick={handleSubmit}
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </div>
    );
}
