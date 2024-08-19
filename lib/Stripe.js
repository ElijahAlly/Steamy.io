import { loadStripe } from '@stripe/stripe-js';

// Ensure that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is defined in your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default stripePromise;