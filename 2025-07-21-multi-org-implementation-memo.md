# Multi-Organization Support Implementation Memo

## Executive Summary

This memo outlines a **simple organization switching approach** for enabling
BfPerson to belong to multiple organizations while maintaining the existing
system architecture. The solution provides 80% of multi-organization benefits
with minimal complexity and risk.

## Current State Analysis

### System Architecture

- **Single Organization Model**: Each user belongs to exactly one organization
  via `memberOf` edge
- **CurrentViewer Pattern**: Authentication assumes single `orgBfOid` per
  session
- **Data Isolation**: All queries filtered by user's organization context
  (`cv.orgBfOid`)
- **No Database Constraints**: Multiple `memberOf` edges technically possible
  but blocked by application logic

### Key Finding

The existing edge-based relationship system already supports multiple
organization memberships at the database level. The constraint is purely in
application logic, making this change much simpler than anticipated.

## Proposed Solution: Organization Switching

### Core Concept

- Users can have multiple `memberOf` relationships to different BfOrganizations
- Sessions maintain single "active" organization context (preserves existing
  architecture)
- Users switch between organizations via simple UI that updates session context
- No changes to data access patterns, authorization, or multi-tenancy logic

### Benefits

- ✅ Minimal code changes compared to full multi-org implementation
- ✅ Preserves existing security and isolation patterns
- ✅ No migration required - works with existing data
- ✅ Low risk - authentication system remains fundamentally unchanged
- ✅ Incremental - can be enhanced later without breaking changes

## Technical Implementation Plan

### Phase 1: Backend Foundation

#### 1.1 Enable Multiple Organization Memberships

**File**: `apps/bfDb/classes/CurrentViewer.ts`

```typescript
// Current: Single organization assignment
// Line ~133: await org.addPersonIfNotMember(person); // COMMENTED OUT

// Change: Enable multiple memberships
await org.addPersonIfNotMember(person); // UNCOMMENT
```

#### 1.2 Organization Selection Logic

**File**: `apps/bfDb/classes/CurrentViewer.ts`

```typescript
// Add after line ~130
static async selectActiveOrganization(
  person: BfPerson, 
  requestedDomain?: string
): Promise<BfGid> {
  const orgs = await person.queryTargetInstances("memberOf", BfOrganization);
  
  // Priority: Requested domain > Last used > First available
  if (requestedDomain) {
    const domainOrg = orgs.find(org => org.domain === requestedDomain);
    if (domainOrg) return domainOrg.bfGid;
  }
  
  // TODO: Add "last used org" preference storage
  return orgs[0]?.bfGid || (null as any);
}
```

#### 1.3 Organization Switching Mutation

**File**: `apps/bfDb/graphql/mutations/switchOrganization.ts` (new)

```typescript
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { CurrentViewer } from "../../classes/CurrentViewer.js";

export const switchOrganization: GraphQLFieldConfig<any, any> = {
  type: GraphQLBoolean,
  args: {
    orgId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    _,
    { orgId },
    { currentViewer }: { currentViewer: CurrentViewer },
  ) => {
    // Validate user has access to this organization
    const person = await currentViewer.getPerson();
    const userOrgs = await person.queryTargetInstances(
      "memberOf",
      BfOrganization,
    );
    const targetOrg = userOrgs.find((org) => org.bfGid === orgId);

    if (!targetOrg) {
      throw new Error("User does not have access to this organization");
    }

    // Update JWT cookie with new organization context
    // Implementation depends on cookie/session management
    return true;
  },
};
```

### Phase 2: Frontend Integration

#### 2.1 Organization Data Query

**File**: New GraphQL query for user's organizations

```typescript
// Add to existing CurrentViewer queries
field CurrentViewer.availableOrganizations {
  person {
    memberOfConnection {
      edges {
        node {
          id
          name  
          domain
        }
      }
    }
  }
}
```

#### 2.2 Organization Switcher Component

**File**: `apps/boltFoundry/components/OrganizationSwitcher.tsx` (new)

```typescript
import React from "react";

interface OrganizationSwitcherProps {
  currentOrg: { id: string; name: string };
  availableOrgs: Array<{ id: string; name: string }>;
  onSwitch: (orgId: string) => void;
}

export function OrganizationSwitcher(
  { currentOrg, availableOrgs, onSwitch }: OrganizationSwitcherProps,
) {
  if (availableOrgs.length <= 1) return null;

  return (
    <select
      value={currentOrg.id}
      onChange={(e) => onSwitch(e.target.value)}
      className="org-switcher"
    >
      {availableOrgs.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
```

#### 2.3 Integration in Navigation

Add OrganizationSwitcher to main navigation component with:

- GraphQL query for available organizations
- Mutation call for switching
- Page refresh after successful switch

### Phase 3: Session Management

#### 3.1 Cookie Update Logic

**File**: `apps/bfDb/graphql/graphqlContextUtils.ts`

```typescript
// Add function to update organization in JWT
export function updateOrganizationInCookies(
  response: Response,
  personGid: string,
  newOrgOid: string,
) {
  const claims: ViewerClaims = {
    personGid,
    orgOid: newOrgOid,
    tokenVersion: Date.now(),
  };

  const token = jwt.sign(claims, JWT_SECRET);
  // Set cookie logic (existing pattern)
}
```

#### 3.2 Switch Organization API Endpoint

**File**: `apps/boltfoundry-com/handlers/switchOrg.ts` (new)

```typescript
export async function handleSwitchOrganization(
  request: Request,
): Promise<Response> {
  const { orgId } = await request.json();
  const currentViewer = await createCurrentViewerFromRequest(request);

  // Validate access and update session
  const success = await switchOrganization({ orgId }, { currentViewer });

  if (success) {
    updateOrganizationInCookies(response, currentViewer.personBfGid, orgId);
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: "Invalid organization" }), {
    status: 403,
  });
}
```

## Testing Plan

### Unit Tests

- [ ] Multiple `memberOf` edge creation and querying
- [ ] Organization selection logic with various scenarios
- [ ] Switch organization mutation validation

### Integration Tests

- [ ] Full authentication flow with multiple organizations
- [ ] Organization switching preserves data isolation
- [ ] UI components handle organization switching gracefully

### Manual Testing Scenarios

1. **Single Organization User**: Existing behavior unchanged
2. **Multi-Organization User**: Can see and switch between organizations
3. **Organization Access**: Cannot switch to unauthorized organizations
4. **Data Isolation**: Switching organizations shows different data sets

## Migration Strategy

### Zero-Downtime Deployment

1. **Phase 1**: Deploy backend changes (no UI changes yet)
   - Multiple memberships enabled but no switching UI
   - Existing single-org users unaffected
2. **Phase 2**: Deploy frontend organization switcher
   - Progressive enhancement - only shows for multi-org users
3. **Phase 3**: Enable multi-org workflows (optional future enhancement)

### Data Migration

**No migration required** - existing `memberOf` relationships work unchanged

## Risk Assessment

### Low Risk ✅

- **Data Model**: No schema changes required
- **Authentication**: Preserves existing CurrentViewer pattern
- **Authorization**: No changes to data access control
- **Performance**: Minimal query overhead

### Medium Risk ⚠️

- **Session Management**: Cookie/JWT updates need careful testing
- **UI State**: Organization switching requires page refresh (acceptable)

### Mitigation Strategies

- **Feature Flag**: Control organization switching rollout
- **Graceful Degradation**: Falls back to single-org behavior on errors
- **Monitoring**: Track organization switching usage and errors

## Success Metrics

### User Experience

- Users can access multiple organizations within 1-2 clicks
- No data loss during organization switching
- Clear indication of current organization context

### Technical Performance

- Organization switching completes within 2 seconds
- No regression in existing single-organization workflows
- Data isolation maintained across all organization switches

## Future Enhancements

This simple approach enables future enhancements without breaking changes:

1. **Simultaneous Multi-Org Views**: Split-screen or tabbed interfaces
2. **Cross-Organization Data Sharing**: Controlled data visibility across orgs
3. **Advanced Permissions**: Role-based access per organization
4. **Organization Management**: Invite flows, admin controls

## Conclusion

The proposed organization switching approach delivers multi-organization support
with minimal complexity and risk. By leveraging the existing edge-based
relationship system and maintaining the single-active-organization session
pattern, we can implement this feature while preserving all existing
architecture benefits.

**Recommendation**: Proceed with implementation starting with Phase 1 backend
changes.

---

**Implementation**: Three-phase approach (Backend Foundation → Frontend
Integration → Session Management)\
**Deployment**: Can be rolled out incrementally with feature flags
