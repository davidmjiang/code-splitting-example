require('./../../js/paypal');

export default class PaymentButtons {
    static initialize() {
        paypal.Button.render({
            env: 'sandbox',
            style: {
              layout: 'vertical',
              size: 'medium',
              shape: 'rect',
              color: 'gold'
            },
            funding: {
              allowed: [
                paypal.FUNDING.CARD,
                paypal.FUNDING.CREDIT
              ],
              disallowed: []
            },
            commit: true,
            client: {
              sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
            },
            payment: function (data, actions) {
              return actions.payment.create({
                payment: {
                  transactions: [
                    {
                      amount: {
                        total: '0.01',
                        currency: 'USD'
                      }
                    }
                  ]
                }
              })
            },
            onAuthorize: function(data, actions) {
              return actions.payment.execute()
              .then(function() {
                window.alert("Payment Complete!");
              });
            }
          }, '#paypal-button-container');
    }
}