const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
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

module.exports = { sendOrderAccepted, sendOrderRejected };
