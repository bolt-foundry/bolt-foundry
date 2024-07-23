import type {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  BfCurrentViewer,
  BfCurrentViewerOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import {
  ACCOUNT_ACTIONS,
  BfAnyid,
  BfCid,
  BfGid,
  getAvailableActionsForRole,
  JsUnixtime,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import type { ConnectionArguments, ConnectionInterface } from "relay-runtime";
import { generateUUID } from "lib/generateUUID.ts";
import {
  bfGetItem,
  bfGetItemByBfGid,
  bfPutItem,
  bfQueryItems,
  bfQueryItemsForGraphQLConnection,
} from "packages/bfDb/bfDb.ts";
import {
  BfModelErrorNotFound,
  BfModelErrorPermission,
} from "packages/bfDb/classes/BfModelError.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
const logVerbose = logger.trace;
const log = logger.trace;

export type BfBaseModelGraphQL<TRequiredProps, TOptionalProps> =
  & TRequiredProps
  & TOptionalProps
  & {
    id: BfGid;
    __typename: string;
  };

abstract class BfBaseModel<
  TRequiredProps,
  TOptionalProps = Record<string | symbol, unknown>,
  TCreationMetadata extends CreationMetadata = CreationMetadata,
> {
  protected static isSorted = false;
  protected static isSelfOwned = false;

  public static async create<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    newProps: TRequiredProps & Partial<TOptionalProps>,
    creationMetadata?: TCreationMetadata,
  ): Promise<
    InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>
  > {
    logVerbose("create", { currentViewer, newProps, creationMetadata });
    const newModel = new this(
      currentViewer,
      undefined,
      newProps,
      creationMetadata,
    );
    log(`Creating ${this.name}, bfGid: ${newModel.metadata.bfGid}`);
    await newModel.beforeCreate();
    await newModel.save();
    await newModel.afterCreate();
    logVerbose("created", { newModel });
    return newModel as
      & InstanceType<TThis>
      & BfBaseModelMetadata<TCreationMetadata>;
  }

  static async find<
    TThis extends
      & typeof BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
      & Constructor<BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>>,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    bfGid: BfAnyid,
  ) {
    try {
      return await this.findX(currentViewer, bfGid);
    } catch (error) {
      if (
        error instanceof BfModelErrorPermission ||
        error instanceof BfModelErrorNotFound
      ) {
        return null;
      }
      throw error;
    }
  }
  static async findX<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    bfGid: BfAnyid,
  ): Promise<
    InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>
  > {
    const model = new this(currentViewer, undefined, undefined, {
      bfGid,
    });
    if (currentViewer instanceof BfCurrentViewerOmni) {
      await model.load__PRIVACY_UNSAFE();
    } else {
      await model.load();
    }

    return model as
      & InstanceType<TThis>
      & BfBaseModelMetadata<TCreationMetadata>;
  }

  static async query<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    metadataToQuery: Partial<BfBaseModelMetadata<TCreationMetadata>>,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
  ): Promise<
    Array<InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>>
  > {
    const items = await bfQueryItems<
      TRequiredProps & Partial<TOptionalProps>,
      BfBaseModelMetadata<TCreationMetadata>
    >(
      metadataToQuery,
      propsToQuery,
    );

    return items.map(({ props, metadata }) => {
      const model = new this(currentViewer, props, {}, metadata, true);
      return model as
        & InstanceType<TThis>
        & BfBaseModelMetadata<TCreationMetadata>;
    });
  }

  static async queryConnectionForGraphQL<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    metadataToQuery: Partial<BfBaseModelMetadata<TCreationMetadata>>,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
    connectionArgs: ConnectionArguments,
  ): Promise<
    ConnectionInterface<
      InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>
    >
  > {
    const { edges, ...others } = await bfQueryItemsForGraphQLConnection<
      TRequiredProps & Partial<TOptionalProps>,
      BfBaseModelMetadata<TCreationMetadata>
    >(
      metadataToQuery,
      propsToQuery,
      connectionArgs,
    );

    return {
      ...others,
      // @ts-expect-error edge is anytyped but it shouldn't be... it should be a rowitem.
      edges: edges.map((edge) => ({
        cursor: edge.cursor,
        node: new this(
          currentViewer,
          edge.node.props,
          {},
          edge.node.metadata,
          true,
        ),
      })),
    };
  }

  private static generateDefaultMetadata<
    TCreationMetadata extends CreationMetadata = CreationMetadata,
  >(
    bfCid: BfCid,
    bfGid = generateUUID(),
    bfOid = bfGid,
    sortValue = this.generateSortValue(),
  ): BfBaseModelMetadata<TCreationMetadata> {
    // @ts-expect-error #techdebt this isn't correctly typed (and perhaps correctly implemented.)
    return {
      bfCid,
      bfGid,
      bfOid,
      sortValue,
      className: this.name,
      createdAt: Date.now() as JsUnixtime,
      lastUpdated: Date.now() as JsUnixtime,
    };
  }

  protected static generateSortValue(): number {
    return Date.now();
  }

  /*

  Below this point are
 _                                                               _               _
| |             _                                            _  | |             | |
| |____   ___ _| |_ _____ ____   ____ _____    ____  _____ _| |_| |__   ___   __| | ___
| |  _ \ /___|_   _|____ |  _ \ / ___) ___ |  |    \| ___ (_   _)  _ \ / _ \ / _  |/___)
| | | | |___ | | |_/ ___ | | | ( (___| ____|  | | | | ____| | |_| | | | |_| ( (_| |___ |
|_|_| |_(___/   \__)_____|_| |_|\____)_____)  |_|_|_|_____)  \__)_| |_|\___/ \____(___/

After the constructor, try to keep the properties at the top alphabetized, and then the
instance methods at the bottom alphabetized. This is to make it easier to find things.

  */

  /**
   * @description Don't use the constructor directly, use the static create method.
   *
   * @param currentViewer The person who is taking the action
   * @param serverProps Props incoming from the server
   * @param clientProps Props newly created on the client
   * @param metadata Metadata explaining the item's place in the world™
   */
  protected constructor(
    readonly currentViewer: BfCurrentViewer,
    protected serverProps: TRequiredProps & Partial<TOptionalProps> | undefined,
    protected clientProps: Partial<TRequiredProps> & Partial<TOptionalProps>,
    metadata: Partial<BfBaseModelMetadata<TCreationMetadata>> = {},
    _prevent_footguns_dont_use_the_constructor_directly: unknown,
  ) {
    const bfOid = (this.constructor as typeof BfBaseModel).isSelfOwned
      ? undefined
      : metadata.bfOid ?? currentViewer.organizationBfGid;
    const defaultMetadata = (this.constructor as typeof BfBaseModel)
      .generateDefaultMetadata<TCreationMetadata>(
        currentViewer.accountBfGid,
        metadata.bfGid,
        bfOid,
      );
    this.metadata = { ...defaultMetadata, ...metadata };
  }

  metadata: BfBaseModelMetadata<TCreationMetadata>;

  get isNew(): boolean {
    return this.serverProps === undefined;
  }

  get isDirty(): boolean {
    return JSON.stringify(this.clientProps) !==
      JSON.stringify(this.serverProps);
  }

  get props(): TRequiredProps & Partial<TOptionalProps> {
    if (!this._cachedProps) {
      this._cachedProps = new Proxy(this.combinedProps, {
        get: (_target, prop) => {
          logger.trace(`Getting property: ${prop.toString()}`);
          return this
            .combinedProps[prop as keyof TRequiredProps & TOptionalProps];
        },
        set: (_target, prop, value) => {
          logger.trace(`Setting property ${String(prop)} to value ${value}`);
          this.clientProps[prop as keyof TRequiredProps & TOptionalProps] =
            value;
          this._cachedProps = undefined; // Invalidate the cache
          return true;
        },
      });
    }
    return this._cachedProps;
  }
  set props(newProps: Partial<TRequiredProps> & Partial<TOptionalProps>) {
    logger.setLevel(logger.levels.TRACE);
    logger.trace("Setting props:", newProps);
    this.clientProps = newProps;
    this._cachedProps = undefined; // Invalidate the cache
    logger.resetLevel();
  }
  private _cachedProps?: TRequiredProps & Partial<TOptionalProps>;
  private get combinedProps(): TRequiredProps & Partial<TOptionalProps> {
    return { ...this.serverProps, ...this.clientProps } as
      & TRequiredProps
      & Partial<TOptionalProps>;
  }

  toGraphql() {
    return {
      ...this.props,
      id: this.metadata.bfGid,
      // @ts-expect-error we declare the __typename in children classes as a constant
      __typename: this.metadata.className ?? this.__typename ??
        this.constructor.name,
    };
  }

  beforeLoad(): Promise<void> | void {}

  beforeCreate(): Promise<void> | void {}

  afterCreate(): Promise<void> | void {}

  async load() {
    await this.beforeLoad();
    await this.validatePermissions(ACCOUNT_ACTIONS.READ);
    if (!this.metadata.bfOid) {
      this.metadata.bfOid = this.currentViewer.organizationBfGid;
    }
    try {
      const response = await bfGetItem<
        TRequiredProps & Partial<TOptionalProps>,
        BfBaseModelMetadata<TCreationMetadata>
      >(this.metadata.bfOid, this.metadata.bfGid);
      if (response === null) {
        throw new BfModelErrorNotFound(
          `Could not load ${this.constructor.name} with bfOid: ${this.metadata.bfOid} bfGid: ${this.metadata.bfGid}`,
        );
      }
      const { props, metadata } = response;
      if (props) {
        this.serverProps = props;
      }
      this.metadata = metadata;
      return this;
    } catch (error) {
      throw error;
    }
  }

  async load__PRIVACY_UNSAFE() {
    await this.beforeLoad();
    await this.validatePermissions(ACCOUNT_ACTIONS.READ);
    try {
      const response = await bfGetItemByBfGid<
        TRequiredProps & Partial<TOptionalProps>,
        BfBaseModelMetadata<TCreationMetadata>
      >(this.metadata.bfGid);
      if (response === null) {
        throw new BfModelErrorNotFound(
          `Could not load ${this.constructor.name} with bfGid: ${this.metadata.bfGid}`,
        );
      }
      const { props, metadata } = response;
      if (props) {
        this.serverProps = props;
      }
      this.metadata = metadata;
      return this;
    } catch (error) {
      if (error.name === "ItemNotFoundError") {
        throw new BfModelErrorNotFound(
          `Could not find ${this.constructor.name} with bfGid: ${this.metadata.bfGid}`,
        );
      }
      throw error;
    }
  }

  async beforeSave() {}
  async afterSave() {}

  async save() {
    await this.beforeSave();
    await Promise.all([
      this.validatePermissions(ACCOUNT_ACTIONS.WRITE),
      this.validateSave(),
    ]);
    await bfPutItem(
      this.props,
      this.metadata,
    );
    await this.load();
    await this.afterSave();
  }

  validatePermissions(action: ACCOUNT_ACTIONS): Promise<boolean> | boolean {
    const availableActions = getAvailableActionsForRole(
      this.currentViewer.role,
    );
    if (availableActions.includes(action)) {
      return true;
    }
    throw new BfModelErrorPermission(
      `Your role (${this.currentViewer.role}) does not have permission to ${action} on ${this.constructor.name}.`,
    );
  }

  validateSave(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

/**
 * @description A BfModel is our primary way of interacting with the database.
 * It is a class that represents a single item in the database, and it has
 * methods for saving, deleting, and validating permissions.
 *
 * This is the primary class to extend. It's mostly an indirection to the BfBaseModel
 * class because we've exposed the constructor in a way which lets subclasses
 * inherit, but doesn't allow the constructor to be called directly.
 *
 * @example
 * type MyModelRequiredProps = {
 *  name: string;
 * }
 * type MyModelOptionalProps = {
 * description?: string;
 * }
 * class MyModel extends BfModel<MyModelRequiredProps, MyModelOptionalProps> {}
 * const myModel = MyModel.create(currentViewer, { name: "my name" });
 */
export abstract class BfModel<
  TRequiredProps,
  TOptionalProps = Record<string | symbol, unknown>,
  TCreationMetadata extends CreationMetadata = CreationMetadata,
> extends BfBaseModel<TRequiredProps, TOptionalProps, TCreationMetadata> {
  constructor(
    currentViewer: BfCurrentViewer,
    serverProps: TRequiredProps & Partial<TOptionalProps> | undefined,
    clientProps: Partial<TRequiredProps> & Partial<TOptionalProps>,
    metadata: Partial<BfBaseModelMetadata<TCreationMetadata>>,
    prevent_footguns_dont_use_the_constructor_directly: unknown,
  ) {
    super(
      currentViewer,
      serverProps,
      clientProps,
      metadata,
      prevent_footguns_dont_use_the_constructor_directly,
    );
  }
}
