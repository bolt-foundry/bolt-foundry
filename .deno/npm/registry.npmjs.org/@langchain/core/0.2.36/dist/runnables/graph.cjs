"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const uuid_1 = require("uuid");
const utils_js_1 = require("./utils.cjs");
const graph_mermaid_js_1 = require("./graph_mermaid.cjs");
const MAX_DATA_DISPLAY_NAME_LENGTH = 42;
function nodeDataStr(node) {
    if (!(0, uuid_1.validate)(node.id)) {
        return node.id;
    }
    else if ((0, utils_js_1.isRunnableInterface)(node.data)) {
        try {
            let data = node.data.getName();
            data = data.startsWith("Runnable") ? data.slice("Runnable".length) : data;
            if (data.length > MAX_DATA_DISPLAY_NAME_LENGTH) {
                data = `${data.substring(0, MAX_DATA_DISPLAY_NAME_LENGTH)}...`;
            }
            return data;
        }
        catch (error) {
            return node.data.getName();
        }
    }
    else {
        return node.data.name ?? "UnknownSchema";
    }
}
function nodeDataJson(node) {
    // if node.data is implements Runnable
    if ((0, utils_js_1.isRunnableInterface)(node.data)) {
        return {
            type: "runnable",
            data: {
                id: node.data.lc_id,
                name: node.data.getName(),
            },
        };
    }
    else {
        return {
            type: "schema",
            data: { ...(0, zod_to_json_schema_1.zodToJsonSchema)(node.data.schema), title: node.data.name },
        };
    }
}
class Graph {
    constructor() {
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "edges", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    // Convert the graph to a JSON-serializable format.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        const stableNodeIds = {};
        Object.values(this.nodes).forEach((node, i) => {
            stableNodeIds[node.id] = (0, uuid_1.validate)(node.id) ? i : node.id;
        });
        return {
            nodes: Object.values(this.nodes).map((node) => ({
                id: stableNodeIds[node.id],
                ...nodeDataJson(node),
            })),
            edges: this.edges.map((edge) => {
                const item = {
                    source: stableNodeIds[edge.source],
                    target: stableNodeIds[edge.target],
                };
                if (typeof edge.data !== "undefined") {
                    item.data = edge.data;
                }
                if (typeof edge.conditional !== "undefined") {
                    item.conditional = edge.conditional;
                }
                return item;
            }),
        };
    }
    addNode(data, id) {
        if (id !== undefined && this.nodes[id] !== undefined) {
            throw new Error(`Node with id ${id} already exists`);
        }
        const nodeId = id || (0, uuid_1.v4)();
        const node = { id: nodeId, data };
        this.nodes[nodeId] = node;
        return node;
    }
    removeNode(node) {
        // Remove the node from the nodes map
        delete this.nodes[node.id];
        // Filter out edges connected to the node
        this.edges = this.edges.filter((edge) => edge.source !== node.id && edge.target !== node.id);
    }
    addEdge(source, target, data, conditional) {
        if (this.nodes[source.id] === undefined) {
            throw new Error(`Source node ${source.id} not in graph`);
        }
        if (this.nodes[target.id] === undefined) {
            throw new Error(`Target node ${target.id} not in graph`);
        }
        const edge = {
            source: source.id,
            target: target.id,
            data,
            conditional,
        };
        this.edges.push(edge);
        return edge;
    }
    firstNode() {
        const targets = new Set(this.edges.map((edge) => edge.target));
        const found = [];
        Object.values(this.nodes).forEach((node) => {
            if (!targets.has(node.id)) {
                found.push(node);
            }
        });
        return found[0];
    }
    lastNode() {
        const sources = new Set(this.edges.map((edge) => edge.source));
        const found = [];
        Object.values(this.nodes).forEach((node) => {
            if (!sources.has(node.id)) {
                found.push(node);
            }
        });
        return found[0];
    }
    /**
     * Add all nodes and edges from another graph.
     * Note this doesn't check for duplicates, nor does it connect the graphs.
     */
    extend(graph, prefix = "") {
        let finalPrefix = prefix;
        const nodeIds = Object.values(graph.nodes).map((node) => node.id);
        if (nodeIds.every(uuid_1.validate)) {
            finalPrefix = "";
        }
        const prefixed = (id) => {
            return finalPrefix ? `${finalPrefix}:${id}` : id;
        };
        Object.entries(graph.nodes).forEach(([key, value]) => {
            this.nodes[prefixed(key)] = { ...value, id: prefixed(key) };
        });
        const newEdges = graph.edges.map((edge) => {
            return {
                ...edge,
                source: prefixed(edge.source),
                target: prefixed(edge.target),
            };
        });
        // Add all edges from the other graph
        this.edges = [...this.edges, ...newEdges];
        const first = graph.firstNode();
        const last = graph.lastNode();
        return [
            first ? { id: prefixed(first.id), data: first.data } : undefined,
            last ? { id: prefixed(last.id), data: last.data } : undefined,
        ];
    }
    trimFirstNode() {
        const firstNode = this.firstNode();
        if (firstNode) {
            const outgoingEdges = this.edges.filter((edge) => edge.source === firstNode.id);
            if (Object.keys(this.nodes).length === 1 || outgoingEdges.length === 1) {
                this.removeNode(firstNode);
            }
        }
    }
    trimLastNode() {
        const lastNode = this.lastNode();
        if (lastNode) {
            const incomingEdges = this.edges.filter((edge) => edge.target === lastNode.id);
            if (Object.keys(this.nodes).length === 1 || incomingEdges.length === 1) {
                this.removeNode(lastNode);
            }
        }
    }
    drawMermaid(params) {
        const { withStyles, curveStyle, nodeColors = { start: "#ffdfba", end: "#baffc9", other: "#fad7de" }, wrapLabelNWords, } = params ?? {};
        const nodes = {};
        for (const node of Object.values(this.nodes)) {
            nodes[node.id] = nodeDataStr(node);
        }
        const firstNode = this.firstNode();
        const firstNodeLabel = firstNode ? nodeDataStr(firstNode) : undefined;
        const lastNode = this.lastNode();
        const lastNodeLabel = lastNode ? nodeDataStr(lastNode) : undefined;
        return (0, graph_mermaid_js_1.drawMermaid)(nodes, this.edges, {
            firstNodeLabel,
            lastNodeLabel,
            withStyles,
            curveStyle,
            nodeColors,
            wrapLabelNWords,
        });
    }
    async drawMermaidPng(params) {
        const mermaidSyntax = this.drawMermaid(params);
        return (0, graph_mermaid_js_1.drawMermaidPng)(mermaidSyntax, {
            backgroundColor: params?.backgroundColor,
        });
    }
}
exports.Graph = Graph;