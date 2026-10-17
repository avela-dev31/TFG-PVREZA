const nodemailer = require('nodemailer');

const smtpPort = Number(process.env.SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.es',
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOrderAccepted = async (to, nombreUsuario, pedido, detalles) => {
  const itemsHtml = detalles.map(d =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${d.nombre} (${d.talla})</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${d.cantidad}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${(d.precio_unitario * d.cantidad).toFixed(2)} €</td>
    </tr>`
  ).join('');

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#000">
      <div style="text-align:center;padding:30px 0;border-bottom:2px solid #000">
        <h1 style="font-size:18px;letter-spacing:4px;margin:0">PVREZA CLUB®</h1>
      </div>
      <div style="padding:30px 20px">
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>Tu pedido <strong>#${pedido.id_pedido}</strong> ha sido <strong>aceptado</strong> y está siendo preparado.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #000">
              <th style="padding:8px;text-align:left;font-size:12px;letter-spacing:1px">PRODUCTO</th>
              <th style="padding:8px;text-align:center;font-size:12px;letter-spacing:1px">CANT.</th>
              <th style="padding:8px;text-align:right;font-size:12px;letter-spacing:1px">PRECIO</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:10px">TOTAL: ${Number(pedido.total).toFixed(2)} €</p>
        <p style="color:#666;font-size:13px;margin-top:30px">Recibirás otra notificación cuando tu pedido sea enviado.</p>
      </div>
      <div style="text-align:center;padding:20px;border-top:1px solid #eee;font-size:11px;color:#999;letter-spacing:1px">
        © ${new Date().getFullYear()} PVREZA. TODOS LOS DERECHOS RESERVADOS.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"PVREZA CLUB" <${process.env.SMTP_USER}>`,
    to,
    subject: `Pedido #${pedido.id_pedido} aceptado — PVREZA`,
    html,
  });
};

const sendOrderRejected = async (to, nombreUsuario, pedido) => {
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#000">
      <div style="text-align:center;padding:30px 0;border-bottom:2px solid #000">
        <h1 style="font-size:18px;letter-spacing:4px;margin:0">PVREZA CLUB®</h1>
      </div>
      <div style="padding:30px 20px">
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>Lamentamos informarte de que tu pedido <strong>#${pedido.id_pedido}</strong> no ha podido ser procesado.</p>
        <p>El importe de <strong>${Number(pedido.total).toFixed(2)} €</strong> será reembolsado a tu método de pago original.</p>
        <p style="color:#666;font-size:13px;margin-top:30px">Si tienes dudas, no dudes en contactarnos.</p>
      </div>
      <div style="text-align:center;padding:20px;border-top:1px solid #eee;font-size:11px;color:#999;letter-spacing:1px">
        © ${new Date().getFullYear()} PVREZA. TODOS LOS DERECHOS RESERVADOS.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"PVREZA CLUB" <${process.env.SMTP_USER}>`,
    to,
    subject: `Pedido #${pedido.id_pedido} cancelado — PVREZA`,
    html,
  });
};

const sendPasswordReset = async (to, nombreUsuario, resetUrl) => {
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#000">
      <div style="text-align:center;padding:30px 0;border-bottom:2px solid #000">
        <h1 style="font-size:18px;letter-spacing:4px;margin:0">PVREZA CLUB®</h1>
      </div>
      <div style="padding:30px 20px">
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <div style="text-align:center;margin:30px 0">
          <a href="${resetUrl}" style="background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:13px;letter-spacing:2px;font-weight:bold">RESTABLECER CONTRASEÑA</a>
        </div>
        <p style="color:#666;font-size:13px">Este enlace expira en 1 hora. Si no has solicitado este cambio, ignora este mensaje.</p>
      </div>
      <div style="text-align:center;padding:20px;border-top:1px solid #eee;font-size:11px;color:#999;letter-spacing:1px">
        © ${new Date().getFullYear()} PVREZA. TODOS LOS DERECHOS RESERVADOS.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"PVREZA CLUB" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Restablecer contraseña — PVREZA',
    html,
  });
};

const sendReservaConfirmation = async (to, coleccion, posicion) => {
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#000">
      <div style="text-align:center;padding:30px 0;border-bottom:2px solid #000">
        <h1 style="font-size:18px;letter-spacing:4px;margin:0">PVREZA CLUB®</h1>
      </div>
      <div style="padding:30px 20px">
        <p>Tu reserva para <strong>${coleccion.toUpperCase()}</strong> ha sido confirmada.</p>
        <div style="text-align:center;margin:30px 0;padding:25px;background:#000;color:#fff">
          <p style="font-size:11px;letter-spacing:2px;margin:0 0 8px">TU POSICIÓN</p>
          <p style="font-size:36px;font-weight:bold;margin:0">#${posicion}</p>
          <p style="font-size:11px;letter-spacing:1px;margin:8px 0 0;color:#999">DE 10 PLAZAS</p>
        </div>
        <p>Serás de los primeros en acceder a la colección cuando se lance. Te avisaremos por email.</p>
        <p style="color:#666;font-size:13px;margin-top:30px">Gracias por confiar en PVREZA.</p>
      </div>
      <div style="text-align:center;padding:20px;border-top:1px solid #eee;font-size:11px;color:#999;letter-spacing:1px">
        © ${new Date().getFullYear()} PVREZA. TODOS LOS DERECHOS RESERVADOS.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"PVREZA CLUB" <${process.env.SMTP_USER}>`,
    to,
    subject: `Reserva confirmada — ${coleccion.toUpperCase()} — PVREZA`,
    html,
  });
};

const sendWelcome = async (to, nombreUsuario) => {
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#000">
      <div style="text-align:center;padding:30px 0;border-bottom:2px solid #000">
        <h1 style="font-size:18px;letter-spacing:4px;margin:0">PVREZA CLUB®</h1>
      </div>
      <div style="padding:30px 20px">
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>Bienvenido/a a <strong>PVREZA CLUB</strong>. Tu cuenta ha sido creada correctamente.</p>
        <p>Ya puedes explorar nuestras colecciones, guardar tus favoritos y realizar pedidos.</p>
        <div style="text-align:center;margin:30px 0">
          <a href="${(process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0]}/catalogo" style="background:#000;color:#fff;padding:14px 32px;text-decoration:none;font-size:13px;letter-spacing:2px;font-weight:bold">EXPLORAR COLECCIONES</a>
        </div>
        <p style="color:#666;font-size:13px;margin-top:30px">Gracias por unirte a PVREZA.</p>
      </div>
      <div style="text-align:center;padding:20px;border-top:1px solid #eee;font-size:11px;color:#999;letter-spacing:1px">
        © ${new Date().getFullYear()} PVREZA. TODOS LOS DERECHOS RESERVADOS.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"PVREZA CLUB" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Bienvenido/a a PVREZA CLUB',
    html,
  });
};

module.exports = { sendOrderAccepted, sendOrderRejected, sendPasswordReset, sendReservaConfirmation, sendWelcome };
