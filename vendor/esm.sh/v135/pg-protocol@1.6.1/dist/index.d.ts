/// <reference path="https://esm.sh/v135/node.ns.d.ts" />
import { DatabaseError } from './messages.d.ts';
import { serialize } from './serializer.d.ts';
import { MessageCallback } from './parser.d.ts';
export declare function parse(stream: NodeJS.ReadableStream, callback: MessageCallback): Promise<void>;
export { serialize, DatabaseError };
