import type {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  BfCurrentViewer,
  BfCurrentViewerServiceAccount,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import {
  ACCOUNT_ACTIONS,
  BfGid,
  BfPk,
  BfSk,
  BfSortValue,
  getAvailableActionsForRole,
  JsUnixtime,
  toBfGid,
  toBfOid,
  toBfOwnerWithParentPk,
  toBfSkSorted,
  toBfSkUnsorted,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { generateUUID } from "lib/generateUUID.ts";
import {
  bfFindItems,
  bfGetItem,
  bfGetItemByBfGid,
  bfPutItem,
  bfQueryItems,
} from "packages/bfDb/bfDb.ts";
import {
  BfModelErrorNotFound,
  BfModelErrorPermission,
} from "packages/bfDb/classes/BfModelError.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
const logVerbose = logger.trace;
const log = logger.trace;

function metadataToBfPk(metadata: BfBaseModelMetadata): BfPk {
  if (metadata.bfPid) {
    return toBfOwnerWithParentPk(metadata.bfOid, metadata.bfPid);
  }
  return metadata.bfOid;
}

function metadataToBfSk(metadata: BfBaseModelMetadata): BfSk {
  if (metadata.sortValue) {
    return toBfSkSorted(
      metadata.className,
      metadata.sortValue,
      metadata.bfGid,
    );
  }
  return toBfSkUnsorted(metadata.className, metadata.bfGid);
}

export type BfBaseModelGraphQL<TRequiredProps, TOptionalProps> =
  & TRequiredProps
  & TOptionalProps
  & {
    id: BfGid;
    __typename: string;
  };

type ExtractProps<TModel> = TModel extends // deno-lint-ignore no-explicit-any
BfModel<infer TRequiredProps, infer TOptionalProps, any>
  ? TRequiredProps & TOptionalProps
  : never;

type ExtractMetadata<TModel> = TModel extends // deno-lint-ignore no-explicit-any
BfModel<any, any, infer TCreationMetadata>
  ? BfBaseModelMetadata<TCreationMetadata>
  : never;

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
    // #bfModelReturn: the BfBaseModelMetadata comes from the proxy in the constructor.
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
    bfGid: BfGid,
    sortValue?: BfSortValue,
  ) {
    try {
      return await this.findX(currentViewer, bfGid, sortValue);
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
    bfGid: BfGid,
    sortValue?: BfSortValue,
  ): Promise<
    InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>
  > {
    const model = new this(currentViewer, undefined, undefined, {
      bfGid,
      sortValue,
    });
    if (currentViewer instanceof BfCurrentViewerServiceAccount) {
      log(
        `Loading ${this.name} with bfGid: ${bfGid} using service account ${currentViewer.actorBfGid}`,
      );
      await model.load__PRIVACY_UNSAFE();
    } else {
      await model.load();
    }
    // #bfModelReturn
    return model as
      & InstanceType<TThis>
      & BfBaseModelMetadata<TCreationMetadata>;
  }

  static async findAllForOwner<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
  ): Promise<
    Array<InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>>
  > {
    const ownerBfGid = currentViewer.actorBfGid;
    const items = await bfFindItems<TRequiredProps>(
      ownerBfGid,
      toBfSkUnsorted(this.name),
    );

    return items.map(({ props, metadata }) => {
      const model = new this(currentViewer, props, {}, metadata, true);
      return model as
        & InstanceType<TThis>
        & BfBaseModelMetadata<TCreationMetadata>;
    });
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

  private static generateDefaultMetadata<
    TCreationMetadata extends CreationMetadata = CreationMetadata,
  >(
    createdBy: BfGid,
    bfGid = generateUUID(),
    bfOid = toBfOid(bfGid),
    sortValue = this.generateSortValue(),
  ): BfBaseModelMetadata<TCreationMetadata> {
    return {
      createdBy,
      bfGid: toBfGid(bfGid),
      bfOid: toBfOid(bfOid),
      sortValue,
      className: this.name,
      createdAt: Date.now() as JsUnixtime,
      lastUpdated: Date.now() as JsUnixtime,
    } as BfBaseModelMetadata<TCreationMetadata>;
  }

  protected static generateSortValue(): BfSortValue | undefined {
    if (this.isSorted) {
      return Date.now().toString() as BfSortValue;
    }
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
      : metadata.bfOid ?? currentViewer.actorBfGid;
    const defaultMetadata = (this.constructor as typeof BfBaseModel)
      .generateDefaultMetadata<TCreationMetadata>(
        currentViewer.personBfGid,
        metadata.bfGid,
        bfOid,
        metadata.sortValue,
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
  /**
   * @description the partionkey key of the object, ie the owner + separator + the parent
   * @example
   *  "ownerbfGid>parentbfGid"
   */
  get pk(): BfPk {
    return metadataToBfPk(this.metadata);
  }
  get sk(): BfSk {
    return metadataToBfSk(this.metadata);
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
      __typename: this.__typename ?? this.constructor.name,
    };
  }

  beforeLoad(): Promise<void> | void {}

  beforeCreate(): Promise<void> | void {}

  afterCreate(): Promise<void> | void {}

  async load() {
    await this.beforeLoad();
    await this.validatePermissions(ACCOUNT_ACTIONS.READ);
    if (!this.metadata.bfOid) {
      this.metadata.bfOid = this.currentViewer.actorBfGid;
    }
    try {
      const response = await bfGetItem<
        TRequiredProps & Partial<TOptionalProps>,
        BfBaseModelMetadata<TCreationMetadata>
      >(this.pk, this.sk);
      const { props, metadata } = response;
      if (props) {
        this.serverProps = props;
      }
      this.metadata = metadata;
      return this;
    } catch (error) {
      if (error.name === "ItemNotFoundError") {
        throw new BfModelErrorNotFound(
          `Could not find ${this.constructor.name} with bfGid: ${this.metadata.bfGid} using pk: ${this.pk} and sk: ${this.sk}`,
        );
      }
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
      >(this.metadata.bfGid, this.constructor.name as BfSk);
      const { props, metadata } = response;
      if (props) {
        this.serverProps = props;
      }
      this.metadata = metadata;
      return this;
    } catch (error) {
      if (error.name === "ItemNotFoundError") {
        throw new BfModelErrorNotFound(
          `Could not find ${this.constructor.name} with bfGid: ${this.metadata.bfGid} using pk: ${this.pk} and sk: ${this.sk}`,
        );
      }
      throw error;
    }
  }

  async beforeSave() {}

  async save() {
    await this.beforeSave(),
      await Promise.all([
        this.validatePermissions(ACCOUNT_ACTIONS.WRITE),
        this.validateSave(),
      ]);
    await bfPutItem(this.pk, this.sk, this.props, this.metadata);
    await this.load();
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

  async findRelatedAssocs<TAssocModel extends BfModel<unknown>>(
    // deno-lint-ignore no-explicit-any
    AssocClass: new (...args: any[]) => TAssocModel,
  ) {
    // Here we extract the Props and Metadata types based on the klass passed to the method.
    type RelatedProps = ExtractProps<TAssocModel>;
    type RelatedMetadata = ExtractMetadata<TAssocModel>;

    const relatedDbItems = await bfFindItems<RelatedProps, RelatedMetadata>(
      this.pk,
      toBfSkUnsorted(AssocClass.name),
    );

    const relatedModels = relatedDbItems.map(({ props, metadata }) => {
      const model = new AssocClass(
        this.currentViewer,
        props,
        {},
        metadata,
        true,
      );
      return model as InstanceType<typeof AssocClass> & RelatedMetadata;
    });

    return relatedModels;
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
