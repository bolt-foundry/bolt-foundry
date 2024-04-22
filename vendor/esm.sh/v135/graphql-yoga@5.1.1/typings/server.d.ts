import { ExecutionResult } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import { GetEnvelopedFn, PromiseOrValue } from 'https://esm.sh/v135/@envelop/core@5.0.0/typings/index.d.ts';
import { LogLevel, YogaLogger } from 'https://esm.sh/v135/@graphql-yoga/logger@2.0.0/typings/index.d.ts';
import { ServerAdapter, ServerAdapterBaseObject, ServerAdapterRequestHandler, useCORS } from 'https://esm.sh/v135/@whatwg-node/server@0.9.23/typings/index.d.ts';
import { Plugin } from './plugins/types.d.ts';
import { GraphiQLOptions, GraphiQLOptionsOrFactory } from './plugins/use-graphiql.d.ts';
import { ParserAndValidationCacheOptions } from './plugins/use-parser-and-validation-cache.d.ts';
import { YogaSchemaDefinition } from './plugins/use-schema.d.ts';
import { FetchAPI, GraphQLParams, YogaInitialContext, YogaMaskedErrorOpts } from './types.d.ts';
/**
 * Configuration options for the server
 */
export type YogaServerOptions<TServerContext, TUserContext> = {
    /**
     * Enable/disable logging or provide a custom logger.
     * @default true
     */
    logging?: boolean | YogaLogger | LogLevel | undefined;
    /**
     * Prevent leaking unexpected errors to the client. We highly recommend enabling this in production.
     * If you throw `EnvelopError`/`GraphQLError` within your GraphQL resolvers then that error will be sent back to the client.
     *
     * You can lean more about this here:
     * @see https://graphql-yoga.vercel.app/docs/features/error-masking
     *
     * @default true
     */
    maskedErrors?: boolean | Partial<YogaMaskedErrorOpts> | undefined;
    /**
     * Context
     */
    context?: ((initialContext: YogaInitialContext & TServerContext) => Promise<TUserContext> | TUserContext) | Promise<TUserContext> | TUserContext | undefined;
    cors?: Parameters<typeof useCORS>[0] | undefined;
    /**
     * GraphQL endpoint
     * So you need to define it explicitly if GraphQL API lives in a different path other than `/graphql`
     *
     * @default "/graphql"
     */
    graphqlEndpoint?: string | undefined;
    /**
     * Readiness check endpoint
     *
     * @default "/health"
     */
    healthCheckEndpoint?: string | undefined;
    /**
     * Whether the landing page should be shown.
     */
    landingPage?: boolean | undefined;
    /**
     * GraphiQL options
     *
     * @default true
     */
    graphiql?: GraphiQLOptionsOrFactory<TServerContext> | undefined;
    renderGraphiQL?: ((options?: GraphiQLOptions) => PromiseOrValue<BodyInit>) | undefined;
    schema?: YogaSchemaDefinition<TServerContext, TUserContext> | undefined;
    /**
     * Envelop Plugins
     * @see https://envelop.dev/plugins
     */
    plugins?: Array<Plugin<TUserContext & TServerContext & YogaInitialContext> | Plugin | {}> | undefined;
    parserAndValidationCache?: boolean | ParserAndValidationCacheOptions | undefined;
    fetchAPI?: Partial<Record<keyof FetchAPI, any>> | undefined;
    /**
     * GraphQL Multipart Request spec support
     *
     * @see https://github.com/jaydenseric/graphql-multipart-request-spec
     *
     * @default true
     */
    multipart?: boolean | undefined;
    id?: string | undefined;
    /**
     * Batching RFC Support configuration
     *
     * @see https://github.com/graphql/graphql-over-http/blob/main/rfcs/Batching.md
     *
     * @default false
     */
    batching?: BatchingOptions | undefined;
};
export type BatchingOptions = boolean | {
    /**
     * You can limit the number of batched operations per request.
     *
     * @default 10
     */
    limit?: number;
};
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
export declare class YogaServer<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>> implements ServerAdapterBaseObject<TServerContext> {
    /**
     * Instance of envelop
     */
    readonly getEnveloped: GetEnvelopedFn<TUserContext & TServerContext & YogaInitialContext>;
    logger: YogaLogger;
    readonly graphqlEndpoint: string;
    fetchAPI: FetchAPI;
    protected plugins: Array<Plugin<TUserContext & TServerContext & YogaInitialContext, TServerContext>>;
    private onRequestParseHooks;
    private onParamsHooks;
    private onResultProcessHooks;
    private maskedErrorsOpts;
    private id;
    constructor(options?: YogaServerOptions<TServerContext, TUserContext>);
    getResultForParams({ params, request, batched, }: {
        params: GraphQLParams;
        request: Request;
        batched: boolean;
    }, ...args: {} extends TServerContext ? [serverContext?: TServerContext | undefined] : [serverContext: TServerContext]): Promise<ExecutionResult<import("https://esm.sh/v135/graphql@16.8.1/jsutils/ObjMap.d.ts").ObjMap<unknown>, import("https://esm.sh/v135/graphql@16.8.1/jsutils/ObjMap.d.ts").ObjMap<unknown>> | undefined>;
    handle: ServerAdapterRequestHandler<TServerContext>;
}
export type YogaServerInstance<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>> = ServerAdapter<TServerContext, YogaServer<TServerContext, TUserContext>>;
export declare function createYoga<TServerContext extends Record<string, any> = {}, TUserContext extends Record<string, any> = {}>(options: YogaServerOptions<TServerContext, TUserContext>): YogaServerInstance<TServerContext, TUserContext>;
