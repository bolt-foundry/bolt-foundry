// File generated from our OpenAPI spec

declare module 'https://esm.sh/v130/stripe@12.18.0/types/index.d.ts' {
  namespace Stripe {
    namespace Reporting {
      interface ReportTypeRetrieveParams {
        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;
      }

      interface ReportTypeListParams {
        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;
      }

      class ReportTypesResource {
        /**
         * Retrieves the details of a Report Type. (Certain report types require a [live-mode API key](https://stripe.com/docs/keys#test-live-modes).)
         */
        retrieve(
          id: string,
          params?: ReportTypeRetrieveParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Reporting.ReportType>>;
        retrieve(
          id: string,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Reporting.ReportType>>;

        /**
         * Returns a full list of Report Types.
         */
        list(
          params?: ReportTypeListParams,
          options?: RequestOptions
        ): ApiListPromise<Stripe.Reporting.ReportType>;
        list(
          options?: RequestOptions
        ): ApiListPromise<Stripe.Reporting.ReportType>;
      }
    }
  }
}
