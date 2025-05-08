import { BfNode, type InferProps } from "../BfNode.ts";

class BfExampleOrg extends BfNode<InferProps<typeof BfExampleOrg>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
      .int("age")
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
      .number("age")
      .string("isEvil") // hidden from GraphQL
    // // relation example
    // .relation(
    //   "organizations",
    //   () => BfExampleOrg,
    //   (edge) => edge.string("role").string("source"),
    // )
  );
}

const o = new BfExampleOrg();

o.props.email; // string ✓
o.props.age; // number ✓
// @ts-expect-error ❌ Property 'foo' does not exist
o.props.foo?.shouldntWork();

/* ─────────── concrete model ────────── */
class BfExamplePerson extends BfNode<InferProps<typeof BfExamplePerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
      .int("age")
    // // options bag example
    // .string("avatarUrl", {
    //   description: "Resize on demand",
    //   args: (arg) => arg.int("size"),
    // })
    // // connection with custom args, default resolver
    // .connection("organizations", () => BfOrganization, {
    //   description: "All orgs this user belongs to",
    //   args: (arg) =>
    //     arg
    //       .enum("role", () => OrgRoleEnum)
    //       .boolean("activeOnly"),
    //   // no resolver ⇒ defaultRelResolver used
    // })
    // // connection + default args with resolver example
    // .connection(
    //   "organizations",
    //   () => BfExampleOrg,
    //   async (person, { first, after }, ctx) => {
    //     return ctx.edges.loadConnection({
    //       src: person.id,
    //       relName: "organizations",
    //       first,
    //       after,
    //     });
    //   },
    // )
    // // connection with custom args and custom resolver example
    // .connection("followers", () => BfUser, {
    //   args: (arg) => arg.boolean("mutual"),
    //   resolver: async (user, { first, after, mutual }, ctx) => {
    //     return ctx.social.getFollowersConnection(user.id, {
    //       first,
    //       after,
    //       mutual,
    //     });
    //   },
    // })
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
      .number("age")
      .string("isEvil") // hidden from GraphQL
    // // relation example
    // .relation(
    //   "organizations",
    //   () => BfExampleOrg,
    //   (edge) => edge.string("role").string("source"),
    // )
  );
}

/* ─────────── sanity check ────────── */
const p = new BfExamplePerson();

p.props.email; // string ✓
p.props.age.toFixed(); // number ✓
// @ts-expect-error ❌ Property 'foo' does not exist
p.props.foo?.shouldntWork();
