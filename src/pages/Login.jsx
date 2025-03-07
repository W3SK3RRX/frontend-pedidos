import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import api from "../services/auth";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.login(username, password);
            
            const role = response.role; // Obtém o papel do usuário
    
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/restaurant/dashboard");
            }
        } catch (error) {
            alert("Erro ao fazer login. Verifique suas credenciais.");
        }
    };    

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Usuário</label>
                        <InputText 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Digite seu usuário" 
                            className="p-inputtext-lg"
                        />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <InputText 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Digite sua senha" 
                            className="p-inputtext-lg"
                        />
                    </div>
                    <Button label="Entrar" icon="pi pi-sign-in" className="p-button-lg p-button-primary" />
                </form>
                <div className="links">
                    <a href="/forgot-password">Esqueci minha senha</a> |  
                    <a href="/register"> Criar conta</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
