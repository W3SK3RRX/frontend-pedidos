import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from 'primereact/inputmask';
import api from "../services/auth";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        role: null,
        password: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    
    const navigate = useNavigate();

    const roles = [
        { label: "Dono de Restaurante", value: "funcionario" },  // Alterado para "funcionario"
    ];    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("As senhas não coincidem");
            return;
        }
        
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registrationData } = formData;
            
            // Send only the required data to the API
            await api.register({
                username: registrationData.username,
                email: registrationData.email,
                phone: registrationData.phone,
                role: registrationData.role,
                password: registrationData.password,
            });
            
            alert("Cadastro realizado com sucesso!");
            navigate("/login");
        }catch (error) {
            console.error("Erro ao cadastrar:", error.response);
            alert(`Erro ao cadastrar: ${error.response?.data?.detail || "Verifique os campos e tente novamente."}`);
        }
        
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Criar Conta</h2>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Usuário</label>
                        <InputText 
                            name="username"
                            value={formData.username} 
                            onChange={handleChange} 
                            placeholder="Digite seu usuário" 
                            className="p-inputtext-lg"
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <InputText 
                            name="email"
                            type="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Digite seu email" 
                            className="p-inputtext-lg"
                            required={formData.role === "RESTAURANT_OWNER"}
                        />
                    </div>
                    <div className="input-group">
                        <label>Telefone</label>
                        <InputMask 
                            name="phone"
                            value={formData.phone} 
                            onChange={handleChange} 
                            mask="(99) 99999-9999"
                            placeholder="(00) 00000-0000" 
                            className="p-inputtext-lg"
                        />
                    </div>
                    <div className="input-group">
                        <label>Tipo de Conta</label>
                        <Dropdown 
                            value={formData.role} 
                            options={roles} 
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.value }))} 
                            placeholder="Selecione seu perfil" 
                            className="p-dropdown-lg"
                        />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <InputText 
                            type="password" 
                            name="password"
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Digite sua senha" 
                            className="p-inputtext-lg"
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirmar Senha</label>
                        <InputText 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="Confirme sua senha" 
                            className="p-inputtext-lg"
                        />
                        {passwordError && (
                            <small className="p-error">{passwordError}</small>
                        )}
                    </div>
                    <Button 
                        label="Cadastrar" 
                        icon="pi pi-user-plus" 
                        className="p-button-lg p-button-success" 
                    />
                </form>
                <div className="links">
                    <a href="/login">Já tem uma conta? Faça login</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
