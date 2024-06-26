// File generated from our OpenAPI spec

declare module 'https://esm.sh/v130/stripe@12.18.0/types/index.d.ts' {
  namespace Stripe {
    namespace TestHelpers {
      interface RefundExpireParams {
        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;
      }

      class RefundsResource {
        /**
         * Expire a refund with a status of requires_action.
         */
        expire(
          id: string,
          params?: RefundExpireParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Refund>>;
        expire(
          id: string,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Refund>>;
      }
    }
  }
}
