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
    <>
      <header>
        <strong>CoronaHUB</strong>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/contact">Opiniones</Link>
          <Link to="/reservation">Reservas</Link>
        </nav>
      </header>
      <main>
        <section className="card">
          <h2>Admin login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit">Entrar</button>
            {error && <p className="error">{error}</p>}
          </form>
        </section>
      </main>
    </>
  );
}
