// File generated from our OpenAPI spec

declare module 'https://esm.sh/v130/stripe@12.18.0/types/index.d.ts' {
  namespace Stripe {
    namespace FinancialConnections {
      /**
       * Describes a snapshot of the owners of an account at a particular point in time.
       */
      interface AccountOwnership {
        /**
         * Unique identifier for the object.
         */
        id: string;

        /**
         * String representing the object's type. Objects of the same type share the same value.
         */
        object: 'financial_connections.account_ownership';

        /**
         * Time at which the object was created. Measured in seconds since the Unix epoch.
         */
        created: number;

        /**
         * A paginated list of owners for this account.
         */
        owners: ApiList<Stripe.FinancialConnections.AccountOwner>;
      }
    }
  }
}
