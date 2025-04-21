## 8 Future Work – `BfConsistencyRule`

Because node props are stored as JSON blobs, current schema changes cannot
declare database‑level constraints such as unique indexes. A dedicated
**`BfConsistencyRule`** mechanism would let us express and enforce invariants in
application code:

| Rule type                 | Example                                                                              | Enforcement strategy                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Uniqueness**            | `BfOrganization.domain` must be unique                                               | Pre‑insert query + transactional edge creation; background job audits & fixes conflicts. |
| **Referential integrity** | A `BfEdgeOrganizationMember` must reference existing `BfPerson` and `BfOrganization` | Hook in edge factory; nightly checker.                                                   |
| **Custom predicates**     | `BfPerson.email` domain must match linked org domain                                 | Validator function attached to rule.                                                     |

`BfConsistencyRule` objects could be registered on startup; each provides:

```ts
{
  id: 'org-domain-unique',
  description: 'Organization domains must be globally unique',
  check(): Promise<Violation[]>,
  fix?(violation: Violation): Promise<void>,
}
```

During writes, fast in‑process checks run; a background worker periodically runs
full scans, reports violations, and optionally auto‑fixes where safe.

## 9 Future Work – `BfPrivacyPolicy`

To manage fine‑grained **authorization** inside the graph we’ll introduce a
declarative **`BfPrivacyPolicy`** system. Each node class can register a
`privacyPolicy` object that receives the `currentViewer`, requested `field`, and
node instance, and returns `ALLOW`, `DENY`, or `PARTIAL`.

```ts
export const BfOrganizationPrivacy: BfPrivacyPolicy = {
  canView(node, viewer) {
    // Owners and admins can view all fields
    if (viewer.edgeTo(node)?.role !== OrganizationRole.MEMBER) return "ALLOW";
    // members can’t see billingEmail or apiKeys
    return "PARTIAL";
  },
  canEdit(node, viewer) {
    return viewer.edgeTo(node)?.role === OrganizationRole.OWNER
      ? "ALLOW"
      : "DENY";
  },
};
```

- **Integration point**: GraphQL resolvers call `privacyPolicy.canView` before
  returning each field; violations throw `BfErrorNotAuthorized`.
- **Schema helper**: builder DSL can accept `@private` directive for per‑field
  policy hooks.
- **Testing**: static analyzer runs across sample viewers to ensure no policy
  gaps.
