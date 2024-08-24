'use strict';

var _require = require('../../store/ClientID'),
  generateClientID = _require.generateClientID;
var _require2 = require('../../store/RelayStoreUtils'),
  getStableStorageKey = _require2.getStableStorageKey;
var getRelayHandleKey = require('../../util/getRelayHandleKey');
var ConnectionInterface = require('./ConnectionInterface');
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
var CONNECTION = 'connection';
var NEXT_EDGE_INDEX = '__connection_next_edge_index';
function update(store, payload) {
  var record = store.get(payload.dataID);
  if (!record) {
    return;
  }
  var _ConnectionInterface$ = ConnectionInterface.get(),
    EDGES = _ConnectionInterface$.EDGES,
    END_CURSOR = _ConnectionInterface$.END_CURSOR,
    HAS_NEXT_PAGE = _ConnectionInterface$.HAS_NEXT_PAGE,
    HAS_PREV_PAGE = _ConnectionInterface$.HAS_PREV_PAGE,
    PAGE_INFO = _ConnectionInterface$.PAGE_INFO,
    PAGE_INFO_TYPE = _ConnectionInterface$.PAGE_INFO_TYPE,
    START_CURSOR = _ConnectionInterface$.START_CURSOR;
  var serverConnection = record.getLinkedRecord(payload.fieldKey);
  var serverPageInfo = serverConnection && serverConnection.getLinkedRecord(PAGE_INFO);
  if (!serverConnection) {
    record.setValue(null, payload.handleKey);
    return;
  }
  var clientConnectionID = generateClientID(record.getDataID(), payload.handleKey);
  var clientConnectionField = record.getLinkedRecord(payload.handleKey);
  var clientConnection = clientConnectionField !== null && clientConnectionField !== void 0 ? clientConnectionField : store.get(clientConnectionID);
  var clientPageInfo = clientConnection && clientConnection.getLinkedRecord(PAGE_INFO);
  if (!clientConnection) {
    var connection = store.create(clientConnectionID, serverConnection.getType());
    connection.setValue(0, NEXT_EDGE_INDEX);
    connection.copyFieldsFrom(serverConnection);
    var serverEdges = serverConnection.getLinkedRecords(EDGES);
    if (serverEdges) {
      serverEdges = serverEdges.map(function (edge) {
        return buildConnectionEdge(store, connection, edge);
      });
      connection.setLinkedRecords(serverEdges, EDGES);
    }
    record.setLinkedRecord(connection, payload.handleKey);
    clientPageInfo = store.create(generateClientID(connection.getDataID(), PAGE_INFO), PAGE_INFO_TYPE);
    clientPageInfo.setValue(false, HAS_NEXT_PAGE);
    clientPageInfo.setValue(false, HAS_PREV_PAGE);
    clientPageInfo.setValue(null, END_CURSOR);
    clientPageInfo.setValue(null, START_CURSOR);
    if (serverPageInfo) {
      clientPageInfo.copyFieldsFrom(serverPageInfo);
    }
    connection.setLinkedRecord(clientPageInfo, PAGE_INFO);
  } else {
    if (clientConnectionField == null) {
      record.setLinkedRecord(clientConnection, payload.handleKey);
    }
    var _connection = clientConnection;
    var _serverEdges = serverConnection.getLinkedRecords(EDGES);
    if (_serverEdges) {
      _serverEdges = _serverEdges.map(function (edge) {
        return buildConnectionEdge(store, _connection, edge);
      });
    }
    var prevEdges = _connection.getLinkedRecords(EDGES);
    var prevPageInfo = _connection.getLinkedRecord(PAGE_INFO);
    _connection.copyFieldsFrom(serverConnection);
    if (prevEdges) {
      _connection.setLinkedRecords(prevEdges, EDGES);
    }
    if (prevPageInfo) {
      _connection.setLinkedRecord(prevPageInfo, PAGE_INFO);
    }
    var nextEdges = [];
    var args = payload.args;
    if (prevEdges && _serverEdges) {
      if (args.after != null) {
        var _clientPageInfo;
        var clientEndCursor = (_clientPageInfo = clientPageInfo) === null || _clientPageInfo === void 0 ? void 0 : _clientPageInfo.getValue(END_CURSOR);
        var serverEndCursor = serverPageInfo === null || serverPageInfo === void 0 ? void 0 : serverPageInfo.getValue(END_CURSOR);
        var isAddingEdgesAfterCurrentPage = clientPageInfo && args.after === clientEndCursor;
        var isFillingOutCurrentPage = clientPageInfo && clientEndCursor === serverEndCursor;
        if (isAddingEdgesAfterCurrentPage || isFillingOutCurrentPage) {
          var nodeIDs = new Set();
          mergeEdges(prevEdges, nextEdges, nodeIDs);
          mergeEdges(_serverEdges, nextEdges, nodeIDs);
        } else {
          process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Unexpected after cursor `%s`, edges must ' + 'be fetched from the end of the list (`%s`).', args.after, clientPageInfo && clientPageInfo.getValue(END_CURSOR)) : void 0;
          return;
        }
      } else if (args.before != null) {
        if (clientPageInfo && args.before === clientPageInfo.getValue(START_CURSOR)) {
          var _nodeIDs = new Set();
          mergeEdges(_serverEdges, nextEdges, _nodeIDs);
          mergeEdges(prevEdges, nextEdges, _nodeIDs);
        } else {
          process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Unexpected before cursor `%s`, edges must ' + 'be fetched from the beginning of the list (`%s`).', args.before, clientPageInfo && clientPageInfo.getValue(START_CURSOR)) : void 0;
          return;
        }
      } else {
        nextEdges = _serverEdges;
      }
    } else if (_serverEdges) {
      nextEdges = _serverEdges;
    } else {
      nextEdges = prevEdges;
    }
    if (nextEdges != null && nextEdges !== prevEdges) {
      _connection.setLinkedRecords(nextEdges, EDGES);
    }
    if (clientPageInfo && serverPageInfo) {
      if (args.after == null && args.before == null) {
        clientPageInfo.copyFieldsFrom(serverPageInfo);
      } else if (args.before != null || args.after == null && args.last) {
        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_PREV_PAGE), HAS_PREV_PAGE);
        var startCursor = serverPageInfo.getValue(START_CURSOR);
        if (typeof startCursor === 'string') {
          clientPageInfo.setValue(startCursor, START_CURSOR);
        }
      } else if (args.after != null || args.before == null && args.first) {
        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_NEXT_PAGE), HAS_NEXT_PAGE);
        var endCursor = serverPageInfo.getValue(END_CURSOR);
        if (typeof endCursor === 'string') {
          clientPageInfo.setValue(endCursor, END_CURSOR);
        }
      }
    }
  }
}
function getConnection(record, key, filters) {
  var handleKey = getRelayHandleKey(CONNECTION, key, null);
  return record.getLinkedRecord(handleKey, filters);
}
function getConnectionID(recordID, key, filters) {
  var handleKey = getRelayHandleKey(CONNECTION, key, null);
  var storageKey = getStableStorageKey(handleKey, filters);
  return generateClientID(recordID, storageKey);
}
function insertEdgeAfter(record, newEdge, cursor) {
  var _ConnectionInterface$2 = ConnectionInterface.get(),
    CURSOR = _ConnectionInterface$2.CURSOR,
    EDGES = _ConnectionInterface$2.EDGES;
  var edges = record.getLinkedRecords(EDGES);
  if (!edges) {
    record.setLinkedRecords([newEdge], EDGES);
    return;
  }
  var nextEdges;
  if (cursor == null) {
    nextEdges = edges.concat(newEdge);
  } else {
    nextEdges = [];
    var foundCursor = false;
    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];
      nextEdges.push(edge);
      if (edge == null) {
        continue;
      }
      var edgeCursor = edge.getValue(CURSOR);
      if (cursor === edgeCursor) {
        nextEdges.push(newEdge);
        foundCursor = true;
      }
    }
    if (!foundCursor) {
      nextEdges.push(newEdge);
    }
  }
  record.setLinkedRecords(nextEdges, EDGES);
}
function createEdge(store, record, node, edgeType) {
  var _ConnectionInterface$3 = ConnectionInterface.get(),
    NODE = _ConnectionInterface$3.NODE;
  var edgeID = generateClientID(record.getDataID(), node.getDataID());
  var edge = store.get(edgeID);
  if (!edge) {
    edge = store.create(edgeID, edgeType);
  }
  edge.setLinkedRecord(node, NODE);
  if (edge.getValue('cursor') == null) {
    edge.setValue(null, 'cursor');
  }
  return edge;
}
function insertEdgeBefore(record, newEdge, cursor) {
  var _ConnectionInterface$4 = ConnectionInterface.get(),
    CURSOR = _ConnectionInterface$4.CURSOR,
    EDGES = _ConnectionInterface$4.EDGES;
  var edges = record.getLinkedRecords(EDGES);
  if (!edges) {
    record.setLinkedRecords([newEdge], EDGES);
    return;
  }
  var nextEdges;
  if (cursor == null) {
    nextEdges = [newEdge].concat(edges);
  } else {
    nextEdges = [];
    var foundCursor = false;
    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];
      if (edge != null) {
        var edgeCursor = edge.getValue(CURSOR);
        if (cursor === edgeCursor) {
          nextEdges.push(newEdge);
          foundCursor = true;
        }
      }
      nextEdges.push(edge);
    }
    if (!foundCursor) {
      nextEdges.unshift(newEdge);
    }
  }
  record.setLinkedRecords(nextEdges, EDGES);
}
function deleteNode(record, nodeID) {
  var _ConnectionInterface$5 = ConnectionInterface.get(),
    EDGES = _ConnectionInterface$5.EDGES,
    NODE = _ConnectionInterface$5.NODE;
  var edges = record.getLinkedRecords(EDGES);
  if (!edges) {
    return;
  }
  var nextEdges;
  for (var ii = 0; ii < edges.length; ii++) {
    var edge = edges[ii];
    var node = edge && edge.getLinkedRecord(NODE);
    if (node != null && node.getDataID() === nodeID) {
      if (nextEdges === undefined) {
        nextEdges = edges.slice(0, ii);
      }
    } else if (nextEdges !== undefined) {
      nextEdges.push(edge);
    }
  }
  if (nextEdges !== undefined) {
    record.setLinkedRecords(nextEdges, EDGES);
  }
}
function buildConnectionEdge(store, connection, edge) {
  if (edge == null) {
    return edge;
  }
  var _ConnectionInterface$6 = ConnectionInterface.get(),
    EDGES = _ConnectionInterface$6.EDGES;
  var edgeIndex = connection.getValue(NEXT_EDGE_INDEX);
  !(typeof edgeIndex === 'number') ? process.env.NODE_ENV !== "production" ? invariant(false, 'ConnectionHandler: Expected %s to be a number, got `%s`.', NEXT_EDGE_INDEX, edgeIndex) : invariant(false) : void 0;
  var edgeID = generateClientID(connection.getDataID(), EDGES, edgeIndex);
  var connectionEdge = store.create(edgeID, edge.getType());
  connectionEdge.copyFieldsFrom(edge);
  if (connectionEdge.getValue('cursor') == null) {
    connectionEdge.setValue(null, 'cursor');
  }
  connection.setValue(edgeIndex + 1, NEXT_EDGE_INDEX);
  return connectionEdge;
}
function mergeEdges(sourceEdges, targetEdges, nodeIDs) {
  var _ConnectionInterface$7 = ConnectionInterface.get(),
    NODE = _ConnectionInterface$7.NODE;
  for (var ii = 0; ii < sourceEdges.length; ii++) {
    var edge = sourceEdges[ii];
    if (!edge) {
      continue;
    }
    var node = edge.getLinkedRecord(NODE);
    var nodeID = node && node.getDataID();
    if (nodeID) {
      if (nodeIDs.has(nodeID)) {
        continue;
      }
      nodeIDs.add(nodeID);
    }
    targetEdges.push(edge);
  }
}
module.exports = {
  buildConnectionEdge: buildConnectionEdge,
  createEdge: createEdge,
  deleteNode: deleteNode,
  getConnection: getConnection,
  getConnectionID: getConnectionID,
  insertEdgeAfter: insertEdgeAfter,
  insertEdgeBefore: insertEdgeBefore,
  update: update
};