// controllers/paymentController.js
const stripe = require('../config/stripe');
const emailService = require('../services/emailService');

/**
 * Create a Stripe Checkout session for a subscription.
 * Expects { plan: 'monthly' | 'yearly', customerEmail } in req.body.
 */
exports.createSubscriptionSession = async (req, res) => {
  const { plan, customerEmail } = req.body;
  if (!plan || !customerEmail) {
    return res.status(400).json({ error: 'Plan and customerEmail are required.' });
  }

  // Determine pricing based on selected plan
  let priceId;
  if (plan === 'monthly') {
    priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
  } else if (plan === 'yearly') {
    priceId = process.env.STRIPE_YEARLY_PRICE_ID;
  } else {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Redirect URLs after checkout
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating subscription session:', error);
    res.status(500).json({ error: 'Failed to create subscription session.' });
  }
};

/**
 * Handle Stripe webhook events.
 * Use raw body parser to verify the Stripe signature.
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Ensure rawBody is available
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Process the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        // Handle successful subscription payment
        await emailService.sendEmailNotification({
          to: session.customer_email,
          subject: 'Subscription Successful',
          text: 'Your subscription has been activated. Thank you for joining LDR!',
        });
        break;
      }
      case 'invoice.payment_failed': {
        const invoiceFailed = event.data.object;
        console.log('Payment failed for invoice:', invoiceFailed.id);
        // Handle payment failure (notify customer, update DB, etc.)
        await emailService.sendEmailNotification({
          to: invoiceFailed.customer_email,
          subject: 'Payment Failed',
          text: 'Your recent payment failed. Please update your payment details.',
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription canceled:', subscription.id);
        // Handle subscription cancellation
        await emailService.sendEmailNotification({
          to: subscription.customer_email,
          subject: 'Subscription Canceled',
          text: 'Your subscription has been canceled. Contact support for details.',
        });
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).send('Webhook handler error.');
  }
};
