declare module 'https://esm.sh/v130/stripe@12.18.0/types/index.d.ts' {
  namespace Stripe {
    type UpcomingInvoice = Omit<Stripe.Invoice, 'id'>;
  }
}
