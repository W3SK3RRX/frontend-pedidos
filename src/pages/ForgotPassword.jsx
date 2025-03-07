import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import api from "../services/auth";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            // Simulação de envio de email de recuperação
            await api.forgotPassword({ email });
            alert("Verifique sua caixa de entrada para redefinir sua senha.");
            navigate("/login");
        } catch (error) {
            alert("Erro ao enviar email. Tente novamente.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Esqueci Minha Senha</h2>
                <form onSubmit={handleForgotPassword}>
                    <div className="input-group">
                        <label>Email</label>
                        <InputText
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            className="p-inputtext-lg"
                        />
                    </div>
                    <Button label="Enviar Email" icon="pi pi-envelope" className="p-button-lg p-button-warning" />
                </form>
                <div className="links">
                    <a href="/login">Voltar ao Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
