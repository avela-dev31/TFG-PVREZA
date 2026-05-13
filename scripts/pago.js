// Esperar a que PayPal SDK esté cargado
document.addEventListener("DOMContentLoaded", function () {
  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '29.99' // Precio de la camiseta
          },
          description: "Camiseta Moderniz"
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert('Gracias por tu compra, ' + details.payer.name.given_name + '!');
      });
    },
    onError: function (err) {
      console.error(err);
      alert('Hubo un error con el pago, intenta de nuevo.');
    }
  }).render('#paypal-button');
});


