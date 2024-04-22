import { GraphQLResponse } from "../network/RelayNetworkTypes.d.ts";
import { RelayObservable as Observable } from "../network/RelayObservable.d.ts";
import { Environment, OperationDescriptor, RequestDescriptor } from "../store/RelayStoreTypes.d.ts";

export function fetchQuery(environment: Environment, operation: OperationDescriptor): Observable<GraphQLResponse>;

export function fetchQueryDeduped(
    environment: Environment,
    request: RequestDescriptor,
    fetchFn: () => Observable<GraphQLResponse>,
): Observable<GraphQLResponse>;

export function getPromiseForActiveRequest(environment: Environment, request: RequestDescriptor): Promise<void> | null;

export function getObservableForActiveRequest(
    environment: Environment,
    request: RequestDescriptor,
): Observable<void> | null;
