import { BfNodeBase } from "apps/bfDb/classes/BfNodeBase.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/graphql/builder/builder.ts";
import type {
  BfEdgeBase,
  BfEdgeBaseProps,
} from "apps/bfDb/classes/BfEdgeBase.ts";

export enum RelationshipDirection {
  OUT = "OUT",
  IN = "IN",
}

/**
 * Represents a relationship between two node types
 */
export interface Relationship<T extends BfEdgeBaseProps = BfEdgeBaseProps> {
  target: () => AnyBfNodeCtor; // always a thunk
  direction: RelationshipDirection; // OUT by default
  isMany: boolean; // one-to-one by default
  /**
   * Determines the cascading delete behavior:
   * - false (strong): When source node is deleted, target nodes are also deleted
   * - true (weak): When source node is deleted, target nodes remain
   */
  isWeak: boolean; // strong by default (cascade delete)
  edgeClass?: typeof BfEdgeBase<T>; // optional metadata edge
  metadata?: Record<string, unknown>;
}

/* ───────────── root spec builder ───────────── */
export class BfDbSpecBuilder {
  private relationships: Relationship[] = [];

  /** Start a new relationship chain. */
  linkTo(target: (() => AnyBfNodeCtor) | AnyBfNodeCtor) {
    const thunk =
      typeof target === "function" && target.prototype instanceof BfNodeBase
        ? () => target as AnyBfNodeCtor
        : (target as () => AnyBfNodeCtor);

    const rel: Relationship = {
      target: thunk,
      direction: RelationshipDirection.OUT,
      isMany: false,
      isWeak: false,
      metadata: {},
    };

    this.relationships.push(rel);
    return new RelationshipBuilder(rel, this);
  }

  /** For framework use once class definition is finished. */
  getRelationships() {
    return this.relationships;
  }
}

/* ───────────── single fluent builder ───────────── */
class RelationshipBuilder {
  constructor(
    private rel: Relationship,
    private parent: BfDbSpecBuilder,
  ) {}

  /* ---------- modifiers ---------- */
  many() {
    this.rel.isMany = true;
    return this;
  }
  one() {
    this.rel.isMany = false;
    return this;
  }

  in() {
    this.rel.direction = RelationshipDirection.IN;
    return this;
  }
  out() {
    this.rel.direction = RelationshipDirection.OUT;
    return this;
  }

  cascadeDelete(shouldCascadeDelete: boolean = true) {
    this.rel.isWeak = !shouldCascadeDelete;
    return this;
  }

  edge<T extends BfEdgeBaseProps>(E: typeof BfEdgeBase<T>) {
    this.rel.edgeClass = E;
    return this;
  }

  /* ---------- convenience escape ---------- */
  and() {
    /* lets you write: n.linkTo(A).many().weak().and().linkTo(B)… */
    return this.parent;
  }
}
