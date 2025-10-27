"use client"; // Muy importante: es un componente de cliente

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Importamos el cliente

// Este es el formulario de Login.
// Le pasamos 'onLogin' como prop para avisarle al padre (page.js)
// que el usuario ya inició sesión, aunque onAuthStateChange también lo hará.
export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Usamos Supabase para iniciar sesión
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
        }

        // onAuthStateChange en page.js se encargará de
        // esconder este componente y mostrar el dashboard.
        setLoading(false);
    };

    return (
        <div className="login-container">
            <h2>SEDECyT Analytics</h2>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
            </form>
            {/* Puedes usar los estilos de style.css que te di antes */}
            <style jsx global>{`
        .login-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 2.5rem;
          border-radius: 15px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0px 8px 22px rgba(0, 0, 0, 0.2);
          text-align: center;
          margin: 10vh auto 0 auto;
          animation: fadeIn 1s ease;
        }
        .login-container h2 {
          color: #0d47a1; /* Azul de SEDECYT */
        }
        .input-group {
          margin-bottom: 1.25rem;
          text-align: left;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.3rem;
          font-weight: 600;
        }
        .input-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #0d47a1;
          border-radius: 8px;
        }
        .btn {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          background: #0d47a1;
          color: white;
          transition: background 0.3s;
        }
        .btn:hover {
          background: #ff0066; /* Magenta de SEDECYT */
        }
        .btn:disabled {
          background: #ccc;
        }
        .auth-error {
          color: red;
          margin-bottom: 1rem;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
