import "../App.css";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";

export default function Legal() {
  return (
    <div className="page">
      <Navbar />

      <main className="legal-card" id="main-content" tabIndex={-1}>
        <h2>Aviso legal y polÃ­tica de privacidad</h2>

        <section>
          <h3>1. Titular del sitio web</h3>
          <p>
            Titular: Bar Corona
          </p>
          <p>
            Correo: barcoronatrajano@hotmail.com
          </p>
          <p>
            TelÃ©fono: 615 486 712
          </p>
        </section>

        <section>
          <h3>2. Finalidad</h3>
          <p>
            Esta web permite consultar informaciÃ³n del restaurante y gestionar reservas y reseÃ±as.
          </p>
        </section>

        <section>
          <h3>3. Datos que tratamos</h3>
          <p>
            Para reservas se pueden tratar datos como nombre, correo, telÃ©fono, fecha, hora y notas.
            Para reseÃ±as se trata el nombre, puntuaciÃ³n y comentario.
          </p>
        </section>

        <section>
          <h3>4. Uso de los datos</h3>
          <p>
            Los datos se usan Ãºnicamente para gestionar reservas, moderar reseÃ±as y comunicaciÃ³n asociada
            al servicio solicitado.
          </p>
        </section>

        <section>
          <h3>5. ConservaciÃ³n</h3>
          <p>
            Los datos se conservan durante el tiempo necesario para la finalidad para la que fueron
            recogidos y para cumplir obligaciones legales aplicables.
          </p>
        </section>

        <section>
          <h3>6. Derechos de las personas usuarias</h3>
          <p>
            Puedes solicitar acceso, rectificaciÃ³n, supresiÃ³n u oposiciÃ³n escribiendo al correo de
            contacto indicado arriba.
          </p>
        </section>

        <section>
          <h3>7. Cambios en esta polÃ­tica</h3>
          <p>
            Este texto puede actualizarse para reflejar cambios legales o tÃ©cnicos.
          </p>
        </section>
      </main>

      <FooterSmall />
    </div>
  );
}

