import {
    ReaderFragment,
    ReaderInlineDataFragment,
    ReaderPaginationFragment,
    ReaderRefetchableFragment,
} from "../util/ReaderNode.d.ts";
import { ConcreteRequest } from "../util/RelayConcreteNode.d.ts";

// The type of a graphql`...` tagged template expression.
export type GraphQLTaggedNode =
    | ReaderFragment
    | ConcreteRequest
    | ReaderInlineDataFragment
    | (() => ReaderFragment | ConcreteRequest | ReaderInlineDataFragment);

/**
 * Runtime function to correspond to the `graphql` tagged template function.
 * All calls to this function should be transformed by the plugin.
 */
export function graphql(strings: unknown): GraphQLTaggedNode;

export function getNode(taggedNode: unknown): unknown;

export function isFragment(node: GraphQLTaggedNode): boolean;

export function isRequest(node: GraphQLTaggedNode): boolean;

export function isInlineDataFragment(node: GraphQLTaggedNode): boolean;

export function getFragment(taggedNode: GraphQLTaggedNode): ReaderFragment;

export function getPaginationFragment(taggedNode: GraphQLTaggedNode): ReaderPaginationFragment | null;

export function getRefetchableFragment(taggedNode: GraphQLTaggedNode): ReaderRefetchableFragment | null;

export function getRequest(taggedNode: GraphQLTaggedNode): ConcreteRequest;

export function getInlineDataFragment(taggedNode: GraphQLTaggedNode): ReaderInlineDataFragment;
