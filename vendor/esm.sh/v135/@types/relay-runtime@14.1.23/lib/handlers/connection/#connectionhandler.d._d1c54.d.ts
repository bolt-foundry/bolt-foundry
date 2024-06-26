import {
    HandleFieldPayload,
    ReadOnlyRecordProxy,
    RecordProxy,
    RecordSourceProxy,
} from "../../../lib/store/RelayStoreTypes.d.ts";
import { DataID, Variables } from "../../../lib/util/RelayRuntimeTypes.d.ts";

export interface ConnectionMetadata {
    path: readonly string[] | null | undefined;
    direction: string | null | undefined; // 'forward' | 'backward' | 'bidirectional' | null | undefined;
    cursor: string | null | undefined;
    count: string | null | undefined;
    stream?: boolean | undefined;
}

export function buildConnectionEdge(
    store: RecordSourceProxy,
    connection: RecordProxy,
    edge: RecordProxy | null | undefined,
): RecordProxy | null | undefined;

export function createEdge(
    store: RecordSourceProxy,
    record: RecordProxy,
    node: RecordProxy,
    edgeType: string,
): RecordProxy;

export function deleteNode(record: RecordProxy, nodeID: DataID): void;

export function getConnection(
    record: ReadOnlyRecordProxy,
    key: string,
    filters?: Variables | null,
): RecordProxy | null | undefined;

export function getConnectionID(recordID: DataID, key: string, filters?: Variables | null): DataID;

export function insertEdgeAfter(record: RecordProxy, newEdge: RecordProxy, cursor?: string | null): void;

export function insertEdgeBefore(record: RecordProxy, newEdge: RecordProxy, cursor?: string | null): void;

export function update(store: RecordSourceProxy, payload: HandleFieldPayload): void;
