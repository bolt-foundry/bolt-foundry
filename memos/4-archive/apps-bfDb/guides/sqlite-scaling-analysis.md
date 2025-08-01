# SQLite Scaling Analysis & Migration Timeline

**Date**: 2025-07-23\
**Status**: Anticipated Bottleneck\
**Migration Timeline**: Phase-based approach recommended

## Executive Summary

SQLite's single-writer architecture will become a bottleneck as RLHF workflows
scale and customer count grows. Migration to PostgreSQL is recommended before
Phase 2 bottlenecks to prevent customer-impacting performance issues.

**Key Finding**: PostgreSQL backend is already production-ready - migration
requires only environment variable changes.

## Current SQLite Configuration

### Strengths ✅

- WAL mode enabled for concurrent reads (`DatabaseBackendSqlite.ts:78`)
- 5s busy timeout with exponential backoff retry logic
  (`DatabaseBackendSqlite.ts:337-358`)
- Prepared statement caching per database instance
- Robust test isolation with unique database files

### Limitations ⚠️

- Single connection per backend instance (no connection pooling)
- Single writer constraint causing lock contention under concurrent GraphQL
  mutations
- Limited transaction support (only for schema operations)

## Projected Breaking Points

### Phase 0: Monitoring & Early Warning 📊

**Objective**: Establish baseline metrics and alerts to detect approaching
SQLite limits before they impact customers.

**HyperDX Monitoring Setup**:

**Database Performance Metrics**:

- `sqlite.database_size` - Track SQLite file size growth rate
- `sqlite.busy_timeout_count` - Count of operations hitting 5s timeout
- `sqlite.retry_attempts` - Track exponential backoff retry frequency from
  `DatabaseBackendSqlite.ts:337`
- `sqlite.wal_checkpoint_duration` - Monitor WAL file checkpoint performance

**GraphQL Layer Metrics**:

- `graphql.mutation_duration` - Track write operation latency trends
- `graphql.concurrent_requests` - Monitor simultaneous GraphQL operations
- `graphql.database_lock_errors` - Count "database is locked" exceptions
- `bfnode.cache_hit_ratio` - Monitor per-request cache effectiveness

**RLHF Workflow Metrics**:

- `rlhf.samples_per_hour` - Track data ingestion velocity
- `rlhf.completion_data_size` - Monitor OpenAI response payload sizes
- `rlhf.evaluation_batch_size` - Track concurrent evaluation processing

**Alerting Thresholds**:

- 🟡 **Early Warning**: Database size > 5GB OR retry attempts > 10/hour
- 🟠 **Migration Recommended**: Database size > 10GB OR lock errors > 1% of
  operations
- 🔴 **Critical**: Average mutation latency > 500ms OR lock errors > 5%

**Implementation Notes**:

- Add telemetry to `DatabaseBackendSqlite.ts` retry logic
- Instrument GraphQL context creation/disposal for request concurrency
- Track BfNode creation patterns to project growth

### Phase 1: Write Contention 🟡

**Trigger**: 10-15 active customer organizations with continuous RLHF workflows
**Symptoms**:

- `database is locked` errors increasing in frequency
- GraphQL mutations queuing and timing out
- Retry logic in `DatabaseBackendSqlite.ts:337` activating frequently

**Evidence**: RLHF workflows generate high write volume from:

- Sample completion data (full OpenAI ChatCompletion responses)
- Evaluation results and grader outputs
- Customer feedback processing

### Phase 2: Performance Degradation 🟠

**Trigger**: 100GB+ database size from accumulated RLHF data

**Symptoms**:

- Complex graph traversal queries (`queryAncestorsByClassName`) slow
  significantly
- Connection pagination (`bfQueryItemsForGraphQLConnection`) becomes sluggish
- Index performance degradation on large tables

### Phase 3: Architecture Limitations 🔴

**Trigger**: 50+ customer organizations with operational complexity
**Symptoms**:

- Single SQLite file becomes operational liability
- Enterprise compliance needs (replication, HA, backup) unmet
- Deployment complexity for disaster recovery

## Migration Readiness Assessment

### PostgreSQL Backend Status ✅

**Location**: `apps/bfDb/backend/DatabaseBackendPg.ts`

- Full CRUD operations implemented
- Connection pooling (max 20 connections, 30s idle timeout)
- JSONB support, array operations, recursive CTEs
- Comprehensive test coverage across all backends

### Migration Path

```bash
# Production migration (< 1 week effort):
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
export DATABASE_BACKEND="pg"  # recommended over neon
# Schema auto-initializes, no application code changes needed
```

### Environment Configuration

- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_BACKEND` - Backend selection (`pg`, `neon`, `sqlite`)
- `FORCE_DB_BACKEND` - Testing override

## Architectural Considerations

### GraphQL Layer Impact

**Current State**: Each GraphQL request creates isolated context with
per-request caching

**PostgreSQL Benefits**:

- True concurrent writes via connection pooling
- Better performance for complex nested queries
- Reduced lock contention for real-time subscriptions

### BfNode System Scaling

**Current Patterns**:

- 42+ entity types with complex relationships
- Graph traversal up to 10 levels deep
- Connection-based pagination with cursor management

**PostgreSQL Advantages**:

- Recursive CTEs handle deep traversals more efficiently
- JSONB indexing improves props field queries
- Connection pooling prevents N+1 query bottlenecks

## Recommendation

**Migrate to PostgreSQL before Phase 2** for the following reasons:

1. **Production-ready implementation exists** - minimal migration effort
2. **Current concurrent load patterns** already stress single-writer model
3. **Customer growth trajectory** will hit SQLite limits quickly
4. **RLHF data accumulation** compounds storage and performance issues
5. **"Move fast and ship" philosophy** favors proactive migration over crisis
   response

## Migration Decision Points

Reference Phase 0 monitoring thresholds above for data-driven migration timing:

- **Early Warning (🟡)**: Begin migration planning when Phase 0 alerts trigger
- **Migration Recommended (🟠)**: Execute migration before reaching Phase 2
  bottlenecks
- **Critical (🔴)**: Emergency migration required - customer impact imminent

## Next Steps

1. **Phase 0**: Set up PostgreSQL staging environment for testing
2. **Phase 1a**: Performance benchmarking comparison SQLite vs PostgreSQL
3. **Phase 1b**: Plan production migration window
4. **Before Phase 2**: Execute migration to PostgreSQL

---

_Analysis conducted using comprehensive codebase search and SQLite performance
research. PostgreSQL backend verified as production-ready with full feature
parity._
