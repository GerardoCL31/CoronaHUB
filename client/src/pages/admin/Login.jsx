import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/auth.service.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-login-shell">
      <header>
        <div className="admin-login-topbar">
          <strong>CoronaHUB</strong>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/contact">Opiniones</Link>
            <Link to="/reservation">Reservas</Link>
          </nav>
        </div>
      </header>
      <main className="admin-login-main">
        <section className="admin-login-panel">
          <section className="admin-login-card">
            <div className="admin-login-card-head">
              <p>Acceso privado</p>
              <h1>Iniciar sesion</h1>
              <span>Panel de administracion</span>
            </div>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label className="admin-login-field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="admin@coronahub.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="admin-login-field">
                <span>Contrasena</span>
                <input
                  type="password"
                  placeholder="Tu contrasena"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <button className="admin-login-submit" type="submit">
                Entrar al panel
              </button>

              {error && <p className="admin-login-error">{error}</p>}
            </form>
          </section>
        </section>
      </main>
    </div>
  );
}
