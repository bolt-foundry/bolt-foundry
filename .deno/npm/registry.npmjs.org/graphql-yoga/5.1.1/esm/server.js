/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, specifiedRules, validate } from 'graphql';
import { envelop, useEngine, useExtendContext, useMaskedErrors, } from '@envelop/core';
import { normalizedExecutor } from '@graphql-tools/executor';
import { createLogger } from '@graphql-yoga/logger';
import * as defaultFetchAPI from '@whatwg-node/fetch';
import { createServerAdapter, useCORS, useErrorHandling, } from '@whatwg-node/server';
import { handleError } from './error.js';
import { isGETRequest, parseGETRequest } from './plugins/request-parser/get.js';
import { isPOSTFormUrlEncodedRequest, parsePOSTFormUrlEncodedRequest, } from './plugins/request-parser/post-form-url-encoded.js';
import { isPOSTGraphQLStringRequest, parsePOSTGraphQLStringRequest, } from './plugins/request-parser/post-graphql-string.js';
import { isPOSTJsonRequest, parsePOSTJsonRequest } from './plugins/request-parser/post-json.js';
import { isPOSTMultipartRequest, parsePOSTMultipartRequest, } from './plugins/request-parser/post-multipart.js';
import { useCheckGraphQLQueryParams } from './plugins/request-validation/use-check-graphql-query-params.js';
import { useCheckMethodForGraphQL } from './plugins/request-validation/use-check-method-for-graphql.js';
import { useHTTPValidationError } from './plugins/request-validation/use-http-validation-error.js';
import { useLimitBatching } from './plugins/request-validation/use-limit-batching.js';
import { usePreventMutationViaGET } from './plugins/request-validation/use-prevent-mutation-via-get.js';
import { useGraphiQL } from './plugins/use-graphiql.js';
import { useHealthCheck } from './plugins/use-health-check.js';
import { useParserAndValidationCache, } from './plugins/use-parser-and-validation-cache.js';
import { useRequestParser } from './plugins/use-request-parser.js';
import { useResultProcessors } from './plugins/use-result-processor.js';
import { useSchema } from './plugins/use-schema.js';
import { useUnhandledRoute } from './plugins/use-unhandled-route.js';
import { processRequest as processGraphQLParams, processResult } from './process-request.js';
import { maskError } from './utils/mask-error.js';
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
export class YogaServer {
    /**
     * Instance of envelop
     */
    getEnveloped;
    logger;
    graphqlEndpoint;
    fetchAPI;
    plugins;
    onRequestParseHooks;
    onParamsHooks;
    onResultProcessHooks;
    maskedErrorsOpts;
    id;
    constructor(options) {
        this.id = options?.id ?? 'yoga';
        this.fetchAPI = {
            ...defaultFetchAPI,
        };
        if (options?.fetchAPI) {
            for (const key in options.fetchAPI) {
                if (options.fetchAPI[key]) {
                    this.fetchAPI[key] = options.fetchAPI[key];
                }
            }
        }
        const logger = options?.logging == null ? true : options.logging;
        this.logger =
            typeof logger === 'boolean'
                ? logger === true
                    ? createLogger()
                    : createLogger('silent')
                : typeof logger === 'string'
                    ? createLogger(logger)
                    : logger;
        const maskErrorFn = (typeof options?.maskedErrors === 'object' && options.maskedErrors.maskError) || maskError;
        const maskedErrorSet = new WeakSet();
        this.maskedErrorsOpts =
            options?.maskedErrors === false
                ? null
                : {
                    errorMessage: 'Unexpected error.',
                    ...(typeof options?.maskedErrors === 'object' ? options.maskedErrors : {}),
                    maskError: (error, message) => {
                        if (maskedErrorSet.has(error)) {
                            return error;
                        }
                        const newError = maskErrorFn(error, message, this.maskedErrorsOpts?.isDev);
                        if (newError !== error) {
                            this.logger.error(error);
                        }
                        maskedErrorSet.add(newError);
                        return newError;
                    },
                };
        const maskedErrors = this.maskedErrorsOpts == null ? null : this.maskedErrorsOpts;
        let batchingLimit = 0;
        if (options?.batching) {
            if (typeof options.batching === 'boolean') {
                batchingLimit = 10;
            }
            else {
                batchingLimit = options.batching.limit ?? 10;
            }
        }
        this.graphqlEndpoint = options?.graphqlEndpoint || '/graphql';
        const graphqlEndpoint = this.graphqlEndpoint;
        this.plugins = [
            useEngine({
                parse,
                validate,
                execute: normalizedExecutor,
                subscribe: normalizedExecutor,
                specifiedRules,
            }),
            // Use the schema provided by the user
            !!options?.schema && useSchema(options.schema),
            options?.context != null &&
                useExtendContext(initialContext => {
                    if (options?.context) {
                        if (typeof options.context === 'function') {
                            return options.context(initialContext);
                        }
                        return options.context;
                    }
                    return {};
                }),
            // Middlewares before processing the incoming HTTP request
            useHealthCheck({
                id: this.id,
                logger: this.logger,
                endpoint: options?.healthCheckEndpoint,
            }),
            options?.cors !== false && useCORS(options?.cors),
            options?.graphiql !== false &&
                useGraphiQL({
                    graphqlEndpoint,
                    options: options?.graphiql,
                    render: options?.renderGraphiQL,
                    logger: this.logger,
                }),
            // Middlewares before the GraphQL execution
            useRequestParser({
                match: isGETRequest,
                parse: parseGETRequest,
            }),
            useRequestParser({
                match: isPOSTJsonRequest,
                parse: parsePOSTJsonRequest,
            }),
            options?.multipart !== false &&
                useRequestParser({
                    match: isPOSTMultipartRequest,
                    parse: parsePOSTMultipartRequest,
                }),
            useRequestParser({
                match: isPOSTGraphQLStringRequest,
                parse: parsePOSTGraphQLStringRequest,
            }),
            useRequestParser({
                match: isPOSTFormUrlEncodedRequest,
                parse: parsePOSTFormUrlEncodedRequest,
            }),
            // Middlewares after the GraphQL execution
            useResultProcessors(),
            useErrorHandling((error, request) => {
                const errors = handleError(error, this.maskedErrorsOpts, this.logger);
                const result = {
                    errors,
                };
                return processResult({
                    request,
                    result,
                    fetchAPI: this.fetchAPI,
                    onResultProcessHooks: this.onResultProcessHooks,
                });
            }),
            ...(options?.plugins ?? []),
            // To make sure those are called at the end
            {
                onPluginInit({ addPlugin }) {
                    if (options?.parserAndValidationCache !== false) {
                        addPlugin(
                        // @ts-expect-error Add plugins has context but this hook doesn't care
                        useParserAndValidationCache(!options?.parserAndValidationCache || options?.parserAndValidationCache === true
                            ? {}
                            : options?.parserAndValidationCache));
                    }
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin(useLimitBatching(batchingLimit));
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin(useCheckGraphQLQueryParams());
                    addPlugin(
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    useUnhandledRoute({
                        graphqlEndpoint,
                        showLandingPage: options?.landingPage ?? true,
                    }));
                    // We check the method after user-land plugins because the plugin might support more methods (like graphql-sse).
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin(useCheckMethodForGraphQL());
                    // We make sure that the user doesn't send a mutation with GET
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin(usePreventMutationViaGET());
                    if (maskedErrors) {
                        addPlugin(useMaskedErrors(maskedErrors));
                    }
                    addPlugin(
                    // We handle validation errors at the end
                    useHTTPValidationError());
                },
            },
        ];
        this.getEnveloped = envelop({
            plugins: this.plugins,
        });
        this.plugins = this.getEnveloped._plugins;
        this.onRequestParseHooks = [];
        this.onParamsHooks = [];
        this.onResultProcessHooks = [];
        for (const plugin of this.plugins) {
            if (plugin) {
                if (plugin.onYogaInit) {
                    plugin.onYogaInit({
                        yoga: this,
                    });
                }
                if (plugin.onRequestParse) {
                    this.onRequestParseHooks.push(plugin.onRequestParse);
                }
                if (plugin.onParams) {
                    this.onParamsHooks.push(plugin.onParams);
                }
                if (plugin.onResultProcess) {
                    this.onResultProcessHooks.push(plugin.onResultProcess);
                }
            }
        }
    }
    async getResultForParams({ params, request, batched, }, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...args) {
        try {
            let result;
            for (const onParamsHook of this.onParamsHooks) {
                await onParamsHook({
                    params,
                    request,
                    setParams(newParams) {
                        params = newParams;
                    },
                    setResult(newResult) {
                        result = newResult;
                    },
                    fetchAPI: this.fetchAPI,
                });
            }
            if (result == null) {
                const additionalContext = args[0]?.request
                    ? {
                        params,
                    }
                    : {
                        request,
                        params,
                    };
                const initialContext = args[0]
                    ? batched
                        ? Object.assign({}, args[0], additionalContext)
                        : Object.assign(args[0], additionalContext)
                    : additionalContext;
                const enveloped = this.getEnveloped(initialContext);
                this.logger.debug(`Processing GraphQL Parameters`);
                result = await processGraphQLParams({
                    params,
                    enveloped,
                });
                this.logger.debug(`Processing GraphQL Parameters done.`);
            }
            return result;
        }
        catch (error) {
            const errors = handleError(error, this.maskedErrorsOpts, this.logger);
            const result = {
                errors,
            };
            return result;
        }
    }
    handle = async (request, serverContext) => {
        let url = new Proxy({}, {
            get: (_target, prop, _receiver) => {
                url = new this.fetchAPI.URL(request.url, 'http://localhost');
                return Reflect.get(url, prop, url);
            },
        });
        let requestParser;
        const onRequestParseDoneList = [];
        for (const onRequestParse of this.onRequestParseHooks) {
            const onRequestParseResult = await onRequestParse({
                request,
                url,
                requestParser,
                serverContext,
                setRequestParser(parser) {
                    requestParser = parser;
                },
            });
            if (onRequestParseResult?.onRequestParseDone != null) {
                onRequestParseDoneList.push(onRequestParseResult.onRequestParseDone);
            }
        }
        this.logger.debug(`Parsing request to extract GraphQL parameters`);
        if (!requestParser) {
            return new this.fetchAPI.Response(null, {
                status: 415,
                statusText: 'Unsupported Media Type',
            });
        }
        let requestParserResult = await requestParser(request);
        for (const onRequestParseDone of onRequestParseDoneList) {
            await onRequestParseDone({
                requestParserResult,
                setRequestParserResult(newParams) {
                    requestParserResult = newParams;
                },
            });
        }
        const result = (await (Array.isArray(requestParserResult)
            ? Promise.all(requestParserResult.map(params => this.getResultForParams({
                params,
                request,
                batched: true,
            }, serverContext)))
            : this.getResultForParams({
                params: requestParserResult,
                request,
                batched: false,
            }, serverContext)));
        return processResult({
            request,
            result,
            fetchAPI: this.fetchAPI,
            onResultProcessHooks: this.onResultProcessHooks,
        });
    };
}
export function createYoga(options) {
    const server = new YogaServer(options);
    return createServerAdapter(server, {
        fetchAPI: server.fetchAPI,
        plugins: server['plugins'],
    });
    // TODO: Fix in @whatwg-node/server later
}
