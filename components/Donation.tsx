import { useState } from 'react';
import { useRouter } from 'next/router';
import stripePromise from '@/lib/Stripe';
import { Elements } from '@stripe/react-stripe-js';

const DonationForm = () => {
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Create a checkout session on the server
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    const session = await res.json();

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) return;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter donation amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Donate</button>
      </form>
    </div>
  );
};

export default function DonationPage() {
  return (
    <Elements stripe={stripePromise}>
      <DonationForm />
    </Elements>
  );
}