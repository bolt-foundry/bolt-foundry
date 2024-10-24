import type {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  type BfCurrentViewer,
  IBfCurrentViewerInternalAdmin,
  IBfCurrentViewerInternalAdminOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import {
  ACCOUNT_ACTIONS,
  type BfAnyid,
  type BfCid,
  type BfGid,
  getAvailableActionsForRole,
  type JsUnixtime,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { generateUUID } from "lib/generateUUID.ts";
import {
  bfDeleteItem,
  bfGetItem,
  bfGetItemByBfGid,
  bfPutItem,
  bfQueryItems,
  type bfQueryItemsForGraphQLConnection,
  bfQueryItemsWithSizeLimit,
  bfSubscribeToItemChanges,
  sortValueToCursor,
  transactionCommit,
  transactionRollback,
  transactionStart,
} from "packages/bfDb/bfDb.ts";
import {
  BfModelErrorClassMismatch,
  BfModelErrorNotFound,
  BfModelErrorPermission,
} from "packages/bfDb/classes/BfModelError.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);
const logVerbose = logger.debug;
const log = logger.debug;

export type BfBaseModelGraphQL<TRequiredProps, TOptionalProps> =
  & TRequiredProps
  & TOptionalProps
  & {
    id: BfGid;
    __typename: string;
  };

export abstract class BfBaseModel<
  TRequiredProps,
  TOptionalProps = Record<string | symbol, unknown>,
  TCreationMetadata extends CreationMetadata = CreationMetadata,
> {
  protected static isSorted = false;
  protected static isSelfOwned = false;

  /**
   * Dangerous, because using this create function lets you create a node not
   * attached to anything by default. That's pretty dangerous, because it could
   * result in something never getting deleted.
   *
   * Usually, you'll want to use BfNode's createTargetNode function, which would
   * necessarily tie a node from a source to a target.
   */
  public static async __DANGEROUS__createUnattached<
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
    if (currentViewer instanceof IBfCurrentViewerInternalAdminOmni) {
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
    bfGids?: Array<BfAnyid>,
  ): Promise<
    Array<InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>>
  > {
    const currentViewerIsAdmin = currentViewer instanceof
      IBfCurrentViewerInternalAdmin;
    logger.debug("Current viewer is admin:", currentViewerIsAdmin);

    const queryableMetadata = {
      ...metadataToQuery,
      className: this.name,
    };

    if (currentViewerIsAdmin) {
      if (metadataToQuery.bfOid != null) {
        queryableMetadata.bfOid = metadataToQuery.bfOid;
      }
    } else {
      queryableMetadata.bfOid = currentViewer.organizationBfGid;
    }
    logger.debug("Queryable metadata:", queryableMetadata);
    const items = await bfQueryItemsWithSizeLimit<
      TRequiredProps & Partial<TOptionalProps>,
      BfBaseModelMetadata<TCreationMetadata>
    >(
      queryableMetadata,
      propsToQuery,
      bfGids,
    );
    logger.debug("Items:", items);

    return items.map(({ props, metadata }) => {
      const model = new this(currentViewer, props, {}, metadata, true);
      return model as
        & InstanceType<TThis>
        & BfBaseModelMetadata<TCreationMetadata>;
    });
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
          logger.debug(`Getting property: ${prop.toString()}`);
          return this
            .combinedProps[prop as keyof TRequiredProps & TOptionalProps];
        },
        set: (_target, prop, value) => {
          logger.debug(`Setting property ${String(prop)} to value ${value}`);
          if (this.clientProps == null) {
            this.clientProps = {};
          }
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
    logger.debug("Setting props:", newProps);
    this.clientProps = newProps;
    this._cachedProps = undefined; // Invalidate the cache
  }
  private _cachedProps?: TRequiredProps & Partial<TOptionalProps>;
  private get combinedProps(): TRequiredProps & Partial<TOptionalProps> {
    return { ...this.serverProps, ...this.clientProps } as
      & TRequiredProps
      & Partial<TOptionalProps>;
  }

  protected beforeCreate(): Promise<void> | void {}
  protected afterCreate(): Promise<void> | void {}
  protected beforeLoad(): Promise<void> | void {}
  protected beforeSave(): Promise<void> | void {}
  protected afterSave(): Promise<void> | void {}

  protected toString() {
    return `${this.constructor.name}#${this.metadata.bfGid}`;
  }

  protected validateSave(): Promise<boolean> | boolean {
    return true;
  }
  protected validatePermissions(
    action: ACCOUNT_ACTIONS,
  ): Promise<boolean> | boolean {
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

  getSubscriptionForGraphql() {
    return bfSubscribeToItemChanges(this.metadata.bfOid, this.metadata.bfGid);
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

  toGraphqlEdge() {
    return {
      node: this.toGraphql(),
      cursor: sortValueToCursor(this.metadata.sortValue),
    };
  }

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
      const genericClass = this.constructor.name === "BfModel" ||
        this.constructor.name === "BfNode";
      if (metadata.className !== this.constructor.name) {
        if (!genericClass) {
          throw new BfModelErrorClassMismatch(
            `Mismatched classname. Got ${metadata.className} expected ${this.constructor.name}`,
          );
        }
        logger.debug(
          `Mismatched classname. Got ${metadata.className} expected ${this.constructor.name}`,
        );
      }
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
    } catch (errorRaw) {
      const error = errorRaw as Error;
      if (error.name === "ItemNotFoundError") {
        throw new BfModelErrorNotFound(
          `Could not find ${this.constructor.name} with bfGid: ${this.metadata.bfGid}`,
        );
      }
      throw error;
    }
  }

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

  async touch() {
    await this.save();
  }

  async delete() {
    await this.validatePermissions(ACCOUNT_ACTIONS.DELETE);
    try {
      await bfDeleteItem(this.metadata.bfOid, this.metadata.bfGid);
      logger.debug(
        `Deleted ${this.constructor.name} with bfOid: ${this.metadata.bfOid} and bfGid: ${this.metadata.bfGid}`,
      );
    } catch (error) {
      logger.debug(`Failed to delete ${this}:`, error);
      throw error;
    }
  }

  public async transactionStart() {
    await transactionStart();
  }
  public async transactionCommit() {
    await transactionCommit();
  }
  public async transactionRollback() {
    await transactionRollback();
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
