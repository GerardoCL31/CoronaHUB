import "../App.css";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";

export default function Legal() {
  return (
    <div className="page">
      <Navbar />

      <main className="legal-card">
        <h2>Aviso legal y política de privacidad</h2>

        <section>
          <h3>1. Titular del sitio web</h3>
          <p>
            Titular: Bar Corona
          </p>
          <p>
            Correo: barcoronatrajano@hotmail.com
          </p>
          <p>
            Teléfono: 615 486 712
          </p>
        </section>

        <section>
          <h3>2. Finalidad</h3>
          <p>
            Esta web permite consultar información del restaurante y gestionar reservas y reseñas.
          </p>
        </section>

        <section>
          <h3>3. Datos que tratamos</h3>
          <p>
            Para reservas se pueden tratar datos como nombre, correo, teléfono, fecha, hora y notas.
            Para reseñas se trata el nombre, puntuación y comentario.
          </p>
        </section>

        <section>
          <h3>4. Uso de los datos</h3>
          <p>
            Los datos se usan únicamente para gestionar reservas, moderar reseñas y comunicación asociada
            al servicio solicitado.
          </p>
        </section>

        <section>
          <h3>5. Conservación</h3>
          <p>
            Los datos se conservan durante el tiempo necesario para la finalidad para la que fueron
            recogidos y para cumplir obligaciones legales aplicables.
          </p>
        </section>

        <section>
          <h3>6. Derechos de las personas usuarias</h3>
          <p>
            Puedes solicitar acceso, rectificación, supresión u oposición escribiendo al correo de
            contacto indicado arriba.
          </p>
        </section>

        <section>
          <h3>7. Cambios en esta política</h3>
          <p>
            Este texto puede actualizarse para reflejar cambios legales o técnicos.
          </p>
        </section>
      </main>

      <FooterSmall />
    </div>
  );
}
