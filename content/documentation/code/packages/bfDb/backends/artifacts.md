~/workspace$ bff t
↱ /home/runner/workspace/packages/web/web.tsx:256
INFO: Ready to serve
↱ /home/runner/workspace/infra/bff/friends/t.bff.ts:8
INFO: Running tests via 't' command...
↱ /home/runner/workspace/infra/bff/shellBase.ts:23
INFO: Running command: bff test
🌗 Elapsed: 2.0s - ↱ /home/runner/workspace/packages/web/web.tsx:256
INFO: Ready to serve
↱ /home/runner/workspace/infra/bff/friends/test.bff.ts:8
INFO: Running tests...
🌑 Elapsed: 2.2s - Check file:///home/runner/workspace/infra/bff/__tests__/bff.test.ts
Check file:///home/runner/workspace/infra/bff/__tests__/bin_bff.test.ts
Check file:///home/runner/workspace/infra/bff/__tests__/shellbase.test.ts
Check file:///home/runner/workspace/infra/bff/__tests__/tools.test.ts
Check file:///home/runner/workspace/infra/bff/friends/__tests__/llm.test.ts
Check file:///home/runner/workspace/packages/app/contexts/__tests__/RouterContext.test.tsx
Check file:///home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts
Check file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts
Check file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeInMemory.test.ts
Check file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts
Check file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeInMemory.test.ts
Check file:///home/runner/workspace/packages/bfDb/coreModels/__tests__/BfEdge.test.ts
Check file:///home/runner/workspace/packages/bfDb/coreModels/__tests__/BfNode.test.ts
Check file:///home/runner/workspace/packages/bfDb/models/__tests__/BfPersonDemo.test.ts
🌕 Elapsed: 9.8s - running 2 tests from ./infra/bff/__tests__/bff.test.ts
bff: help friend should exist ... ok (0ms)
bff: registering a friend updates friendMap ... ok (0ms)
🌗 Elapsed: 9.9s - running 1 test from ./infra/bff/__tests__/bin_bff.test.ts
bin/bff.ts - import sanity check ... ok (0ms)
🌑 Elapsed: 8.0s - running 4 tests from ./infra/bff/__tests__/shellbase.test.ts
🌑 Elapsed: 10.1s - hellCommand adds a friend ...
------- post-test output -------
↱ /home/runner/workspace/infra/bff/shellBase.ts:23
INFO: Running command: echo hello
hello
↱ /home/runner/workspace/infra/bff/shellBase.ts:48
INFO: Command succeeded: echo hello
----- post-test output end -----
shellBase: registerShellCommand adds a friend ... ok (19ms)
shellBase: runShellCommand should run an echo command ...
------- post-test output -------
↱ /home/runner/workspace/infra/bff/shellBase.ts:23
INFO: Running command: echo shellBaseTest
shellBaseTest
↱ /home/runner/workspace/infra/bff/shellBase.ts:48
INFO: Command succeeded: echo shellBaseTest
----- post-test output end -----
shellBase: runShellCommand should run an echo command ... ok (9ms)
shellBase: runShellCommandWithOutput captures stdout ...
------- post-test output -------
↱ /home/runner/workspace/infra/bff/shellBase.ts:72
INFO: Running command: echo shellBaseOutput
↱ /home/runner/workspace/infra/bff/shellBase.ts:99
INFO: shellBaseOutput

↱ /home/runner/workspace/infra/bff/shellBase.ts:102
INFO: Command succeeded: echo shellBaseOutput
↱ /home/runner/workspace/infra/bff/shellBase.ts:100
WARN: 
----- post-test output end -----
shellBase: runShellCommandWithOutput captures stdout ... ok (13ms)
shellBase: runningProcesses array gets updated ...
------- post-test output -------
↱ /home/runner/workspace/infra/bff/shellBase.ts:23
INFO: Running command: echo test
test
↱ /home/runner/workspace/infra/bff/shellBase.ts:48
INFO: Command succeeded: echo test
----- post-test output end -----
shellBase: runningProcesses array gets updated ... ok (10ms)
🌑 Elapsed: 10.2s - running 0 tests from ./infra/bff/__tests__/tools.test.ts
🌔 Elapsed: 10.4s - running 12 tests from ./infra/bff/friends/__tests__/llm.test.ts
llm - basic usage with no flags ... ok (12ms)
llm - cxml mode ... ok (4ms)
llm - xml escaping in cxml mode ... ok (6ms)
llm - line numbers ... ok (10ms)
llm - ignoring hidden files ... ok (4ms)
llm - include hidden files ... ok (4ms)
llm - ignoring patterns ... ok (5ms)
llm - respect .gitignore by default ... ok (4ms)
llm - ignoring .gitignore with --ignore-gitignore ... ok (3ms)
🌖 Elapsed: 8.4s -  ok (4ms).
🌕 Elapsed: 10.5s -  ok (4ms)..
llm - stdout option ... ok (6ms)
🌓 Elapsed: 11.0s - running 3 tests from ./packages/app/contexts/__tests__/RouterContext.test.tsx
matchRouteWithParams - dynamic route with optional param ... ok (1ms)
matchRouteWithParams - dynamic route with required param ... ok (0ms)
matchRouteWithParams - mismatch returns default object ... ok (0ms)
🌓 Elapsed: 12.5s - running 5 tests from ./packages/bfDb/backend/__tests__/DatabaseBackend.test.ts
global ... ok (0ms)
bfDb - basic CRUD operations ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/bfdb.sqlite
🌔 Elapsed: 12.6s - ↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
🌕 Elapsed: 12.6s - ----- post-test output end -----
bfDb - basic CRUD operations ... ok (148ms)
bfDb - query items ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/bfdb.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:255
INFO: Successfully inserted node with bfGid: test-query-node-1
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:255
INFO: Successfully inserted node with bfGid: test-query-node-2
🌖 Elapsed: 12.7s - ----- post-test output end -----
bfDb - query items ... FAILED (107ms)
bfDb - metadata handling ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/classes/BfCurrentViewer.ts:195
WARN: Creating Logged in user: file:///home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/bfdb.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
🌘 Elapsed: 12.9s - ----- post-test output end -----
bfDb - metadata handling ... ok (117ms)
Database backends compatibility test ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:392
INFO: Testing database backends compatibility
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:408
INFO: Skipping Neon and PostgreSQL tests - DATABASE_URL not set
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:412
INFO: Testing SQLite backend
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:45
INFO: Using unique SQLite database: tmp/test-db-test-1741124212451-71.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/test-db-test-1741124212451-71.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
🌘 Elapsed: 13.6s - ↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:55
INFO: SQLite backend tests passed successfully
↱ /home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:66
INFO: Cleaned up test database: tmp/test-db-test-1741124212451-71.sqlite
----- post-test output end -----
Database backends compatibility test ... ok (735ms)
🌖 Elapsed: 14.9s - running 0 tests from ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts
🌒 Elapsed: 16.0s - running 1 test from ./packages/bfDb/classes/__tests__/BfEdgeInMemory.test.ts
BfEdgeBase test suite: BfEdgeInMemory ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/classes/BfCurrentViewer.ts:195
WARN: Creating Logged in user: file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts
----- post-test output end -----
  generateEdgeMetadata should create correct metadata for an edge ... ok (0ms)
  createBetweenNodes should create an edge between two nodes ... ok (1ms)
  querySourceInstances should return source nodes connected to a target node ... ok (0ms)
  querySourceEdgesForNode should return edges where a node is the source ... ok (0ms)
  queryTargetInstances should return target nodes connected to a source node ... ok (1ms)
  queryTargetEdgesForNode should return edges where a node is the target ... ok (1ms)
  cache is used for queryTarget methods ... ok (0ms)
BfEdgeBase test suite: BfEdgeInMemory ... ok (11ms)
🌗 Elapsed: 17.1s - running 0 tests from ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts
🌕 Elapsed: 18.4s - running 1 test from ./packages/bfDb/classes/__tests__/BfNodeInMemory.test.ts
BfNodeBase test suite: BfNodeInMemory ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/classes/BfCurrentViewer.ts:195
WARN: Creating Logged in user: file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts
----- post-test output end -----
  createUnattached should create a node with proper metadata ... ok (1ms)
  should generate unique GIDs for each node ... ok (0ms)
  should allow updating props ... ok (0ms)
  toGraphql should return expected structure ... ok (0ms)
  toString should return a formatted string with metadata ... ok (0ms)
  generateMetadata should create proper metadata ... ok (0ms)
  generateSortValue should create a numeric value ... ok (0ms)
  queryTargets should retrieve target nodes ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/test-db-test-1741124212451-71.sqlite
🌖 Elapsed: 18.5s - ↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
----- post-test output end -----
  queryTargets should retrieve target nodes ... FAILED (101ms)
BfNodeBase test suite: BfNodeInMemory ... FAILED (due to 1 failed step) (109ms)
🌓 Elapsed: 19.7s - running 1 test from ./packages/bfDb/coreModels/__tests__/BfEdge.test.ts
BfEdgeBase test suite: BfEdge ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/classes/BfCurrentViewer.ts:195
WARN: Creating Logged in user: file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts
----- post-test output end -----
  generateEdgeMetadata should create correct metadata for an edge ... ok (0ms)
🌕 Elapsed: 17.7s -  should create an edge between two nodes ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/test-db-test-1741124212451-71.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
🌔 Elapsed: 19.8s - ----- post-test output end -----
  createBetweenNodes should create an edge between two nodes ... ok (16ms)
  querySourceInstances should return source nodes connected to a target node ... FAILED (4ms)
  querySourceEdgesForNode should return edges where a node is the source ... FAILED (3ms)
  queryTargetInstances should return target nodes connected to a source node ... FAILED (2ms)
  queryTargetEdgesForNode should return edges where a node is the target ... FAILED (3ms)
  cache is used for queryTarget methods ... FAILED (2ms)
BfEdgeBase test suite: BfEdge ... FAILED (due to 5 failed steps) (37ms)
🌓 Elapsed: 21.1s - running 1 test from ./packages/bfDb/coreModels/__tests__/BfNode.test.ts
BfNodeBase test suite: BfNode ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/classes/BfCurrentViewer.ts:195
WARN: Creating Logged in user: file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts
----- post-test output end -----
  createUnattached should create a node with proper metadata ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/test-db-test-1741124212451-71.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
----- post-test output end -----
  createUnattached should create a node with proper metadata ... ok (15ms)
  should generate unique GIDs for each node ... ok (1ms)
  should allow updating props ... ok (1ms)
  toGraphql should return expected structure ... ok (1ms)
  toString should return a formatted string with metadata ... ok (0ms)
  generateMetadata should create proper metadata ... ok (1ms)
  generateSortValue should create a numeric value ... ok (0ms)
  queryTargets should retrieve target nodes ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:232
ERROR: Error looking up all edges: TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfNode.queryTargets (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:220:29)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:140:27
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:5
    at async innerWrapped (ext:cli/40_test.js:180:5)
----- post-test output end -----
  queryTargets should retrieve target nodes ... FAILED (8ms)
BfNodeBase test suite: BfNode ... FAILED (due to 1 failed step) (33ms)
🌔 Elapsed: 20.5s - running 1 test from ./packages/bfDb/models/__tests__/BfPersonDemo.test.ts
BfNodeBase test suite: BfPersonDemo ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/classes/BfCurrentViewer.ts:195
WARN: Creating Logged in user: file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts
----- post-test output end -----
  createUnattached should create a node with proper metadata ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:66
INFO: Opening SQLite database at tmp/test-db-test-1741124212451-71.sqlite
↱ /home/runner/workspace/packages/bfDb/backend/DatabaseBackendSqlite.ts:921
INFO: Database schema initialized with SQLite backend
↱ /home/runner/workspace/packages/bfDb/bfDbBackend.ts:93
INFO: Database backend of type sqlite initialized
----- post-test output end -----
  createUnattached should create a node with proper metadata ... ok (34ms)
  should generate unique GIDs for each node ... ok (8ms)
🌔 Elapsed: 22.6s -  ok (5ms) ...
🌕 Elapsed: 20.6s -  ok (1ms)ected structure ...
  toString should return a formatted string with metadata ... ok (2ms)
  generateMetadata should create proper metadata ... ok (0ms)
  generateSortValue should create a numeric value ... ok (0ms)
  queryTargets should retrieve target nodes ...
------- post-test output -------
↱ /home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:232
ERROR: Error looking up all edges: TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfPersonDemo.queryTargets (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:220:29)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:140:27
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:5
    at async innerWrapped (ext:cli/40_test.js:180:5)
----- post-test output end -----
  queryTargets should retrieve target nodes ... FAILED (20ms)
BfNodeBase test suite: BfPersonDemo ... FAILED (due to 1 failed step) (93ms)

 ERRORS 

bfDb - query items => ./packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:222:6
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItems (file:///home/runner/workspace/packages/bfDb/bfDb.ts:305:38)
    at async file:///home/runner/workspace/packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:265:22

BfNodeBase test suite: BfNodeInMemory ... queryTargets should retrieve target nodes => ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfEdge.query (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:111:19)
    at async BfEdge.queryTargetInstances (file:///home/runner/workspace/packages/bfDb/coreModels/BfEdge.ts:183:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:140:27
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:5

BfEdgeBase test suite: BfEdge ... querySourceInstances should return source nodes connected to a target node => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:100:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfEdge.query (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:111:19)
    at async BfEdge.querySourceInstances (file:///home/runner/workspace/packages/bfDb/coreModels/BfEdge.ts:129:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:140:25
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:100:5

BfEdgeBase test suite: BfEdge ... querySourceEdgesForNode should return edges where a node is the source => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:167:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfEdge.query (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:111:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:207:29
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:167:5

BfEdgeBase test suite: BfEdge ... queryTargetInstances should return target nodes connected to a source node => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:221:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfEdge.query (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:111:19)
    at async BfEdge.queryTargetInstances (file:///home/runner/workspace/packages/bfDb/coreModels/BfEdge.ts:183:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:261:25
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:221:5

BfEdgeBase test suite: BfEdge ... queryTargetEdgesForNode should return edges where a node is the target => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:291:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfEdge.query (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:111:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:331:29
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:291:5

BfEdgeBase test suite: BfEdge ... cache is used for queryTarget methods => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:346:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfEdge.query (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:111:19)
    at async BfEdge.queryTargetInstances (file:///home/runner/workspace/packages/bfDb/coreModels/BfEdge.ts:183:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:380:9
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:346:5

BfNodeBase test suite: BfNode ... queryTargets should retrieve target nodes => ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfNode.queryTargets (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:235:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:140:27
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:5

BfNodeBase test suite: BfPersonDemo ... queryTargets should retrieve target nodes => ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:13
error: TypeError: Do not know how to serialize a BigInt
      `First result metadata: ${JSON.stringify(results[0].metadata)}`,
                                     ^
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
    at async BfPersonDemo.queryTargets (file:///home/runner/workspace/packages/bfDb/coreModels/BfNode.ts:235:19)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:140:27
    at async innerWrapped (ext:cli/40_test.js:180:5)
    at async exitSanitizer (ext:cli/40_test.js:96:27)
    at async Object.outerWrapped [as fn] (ext:cli/40_test.js:123:14)
    at async TestContext.step (ext:cli/40_test.js:481:22)
    at async file:///home/runner/workspace/packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:5

 FAILURES 

bfDb - query items => ./packages/bfDb/backend/__tests__/DatabaseBackend.test.ts:222:6
BfNodeBase test suite: BfNodeInMemory ... queryTargets should retrieve target nodes => ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:13
BfEdgeBase test suite: BfEdge ... querySourceInstances should return source nodes connected to a target node => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:100:13
BfEdgeBase test suite: BfEdge ... querySourceEdgesForNode should return edges where a node is the source => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:167:13
BfEdgeBase test suite: BfEdge ... queryTargetInstances should return target nodes connected to a source node => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:221:13
BfEdgeBase test suite: BfEdge ... queryTargetEdgesForNode should return edges where a node is the target => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:291:13
BfEdgeBase test suite: BfEdge ... cache is used for queryTarget methods => ./packages/bfDb/classes/__tests__/BfEdgeBaseTest.ts:346:13
BfNodeBase test suite: BfNode ... queryTargets should retrieve target nodes => ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:13
BfNodeBase test suite: BfPersonDemo ... queryTargets should retrieve target nodes => ./packages/bfDb/classes/__tests__/BfNodeBaseTest.ts:120:13

FAILED | 27 passed (30 steps) | 5 failed (8 steps) (13s)

error: Test failed
🌖 Elapsed: 20.6s - ↱ /home/runner/workspace/infra/bff/friends/test.bff.ts:22
ERROR: ❌ Tests failed
↱ /home/runner/workspace/infra/bff/shellBase.ts:50
ERROR: Command failed with code 1: bff test
~/workspace$ bff llm packages/bfDb infra -c
↱ /home/runner/workspace/packages/web/web.tsx:256
INFO: Ready to serve
↱ /home/runner/workspace/infra/bff/friends/llm.bff.ts:156
INFO: Writing to build/llm.txt
~/workspace$ bff llm content/documentation/code/packages/bfDb/ packages/bfDb infra/
↱ /home/runner/workspace/packages/web/web.tsx:256
INFO: Ready to serve
↱ /home/runner/workspace/infra/bff/friends/llm.bff.ts:156
INFO: Writing to build/llm.txt
~/workspace$ 