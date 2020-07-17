const functions = require('firebase-functions');
const { content } = require('googleapis/build/src/apis/content');

/**
 * Stripe API functions
 * @type {[type]}
 */

const secretKey = functions.config().env["persualia"].stripe.secret;
const stripe = require('stripe')(secretKey);

//exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
/*exports.createStripeCustomer = functions.https.onCall(async(user, _context) => {
    
    let data = {'user':user};
    const customer = await stripe.customers.create({ email: user.email });
    const intent = await stripe.setupIntents.create({
      customer: customer.id,      
    });
    data.customer_id = customer.id;
    data.intent.client_secret = intent.client_secret;
    
    //await admin.firestore().collection('stripe_customers').doc(user.uid).set({
    //  customer_id: customer.id,
    //  setup_secret: intent.client_secret,
    //});

    const { amount, currency, payment_method } = {
        amount: 50,
        currency: "EUR",
        payment_method: {
            name: "Albert",

        }
    }

    const idempotencyKey = _context.params.pushId;
    const payment = await stripe.paymentIntents.create(
        {
            amount,
            currency,
            customer,
            payment_method,
            off_session: false,
            confirm: true,
            confirmation_method: "manual",
        },
        { idempotencyKey }
    );

    return;
  });*/

  