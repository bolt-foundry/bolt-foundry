export const OWNER_PARENT_SEPARATOR = "⚡️!⚡️";
export const SORT_SEPARATOR = "⚡️#⚡️";
export const BFGID_SEPARATOR = "⚡️@⚡️";

declare const __nominal__type: unique symbol;
export type Nominal<Type, Identifier> = Type & {
  readonly [__nominal__type]: Identifier;
};

/**
 * BfGid is a globally unique identifier for a BfModel.
 */
export type BfGid = Nominal<string, "BfGid">;
/**
 * BfOid is an owner for a BfModel. BfOid maps to BfGids.
 */
export type BfOid = Nominal<string, "BfOid"> | BfGid;
/**
 * BfPid is a parent for a BfModel. BfPid maps to BfGids.
 */
export type BfPid = Nominal<string, "BfPid"> | BfGid;
/**
 * BfCid is the creator for a BfModel. BfCid maps to BfGids for accounts only.
 */
export type BfCid = Nominal<string, "BfCid"> | BfGid;
/**
 * BfTid is a target for a BfModel. Most frequently used in assocs. BfTid maps to BfGids.
 */
export type BfTid = Nominal<string, "BfTid"> | BfGid;

export type BfAnyid = BfGid | BfOid | BfPid | BfCid | BfTid;

export type BfAccessToken = Nominal<string, "BfAccessToken">;
export type BfClassName = Nominal<string, "BfClassName">;
export type BfSortValue<T extends string = string> = Nominal<T, "BfSortValue">;
export type Unixtime = Nominal<number, "Unixtime">;
export type JsUnixtime = Nominal<number, "JsUnixtime">;
export type BfOwnerWithParentPk =
  `${BfOid}${typeof OWNER_PARENT_SEPARATOR}${BfPid}`;
export type BfPk = BfOwnerWithParentPk | BfOid | BfGid;
export type BfSkSorted =
  `${BfClassName}${typeof SORT_SEPARATOR}${BfSortValue}${typeof BFGID_SEPARATOR}${BfGid}`;
export type BfSkUnsorted = `${BfClassName}${typeof BFGID_SEPARATOR}${BfGid}`;
export type BfSk = BfSkSorted | BfSkUnsorted;

export function toBfGid(value: string): BfGid {
  return value as BfGid;
}

export function toBfOid(value: string): BfOid {
  return value as BfOid;
}

export function toBfPid(value: string): BfPid {
  return value as BfPid;
}

export function toBfTid(value: string): BfTid {
  return value as BfTid;
}

export function toBfCid(value: string): BfCid {
  return value as BfCid;
}

export function toBfSortValue<T extends string>(value: T): BfSortValue<T> {
  return value as BfSortValue<T>;
}

export function toUnixtime(value: number): Unixtime {
  return value as Unixtime;
}

export function toJsUnixtime(value: number): JsUnixtime {
  return value as JsUnixtime;
}

export function convertJsUnixtimeToUnixtime(value: JsUnixtime): Unixtime {
  const unixtime = value / 1000;
  return toUnixtime(unixtime);
}

export function convertUnixtimeToJsUnixtime(value: Unixtime): JsUnixtime {
  const jsUnixtime = value * 1000;
  return toJsUnixtime(jsUnixtime);
}

export function toBfOwnerWithParentPk(
  bfOid: BfOid,
  bfPid: BfPid,
): BfOwnerWithParentPk {
  return `${bfOid}${OWNER_PARENT_SEPARATOR}${bfPid}` as BfOwnerWithParentPk;
}

export function toBfSkUnsorted(
  bfClassName: string,
  bfGid: BfGid = toBfGid(""),
): BfSkUnsorted {
  return `${bfClassName}${BFGID_SEPARATOR}${bfGid}` as BfSkUnsorted;
}

export function toBfSkSorted<T extends BfSortValue>(
  bfClassName: string,
  bfSortValue: T,
  bfGid: BfGid,
): BfSkSorted {
  return `${bfClassName}${SORT_SEPARATOR}${bfSortValue}${BFGID_SEPARATOR}${bfGid}` as BfSkSorted;
}

export function toBfPk(bfGid: BfGid): BfPk {
  return bfGid as BfPk;
}

export function skToBfGid(sk: BfSkUnsorted | BfSkSorted | string): BfGid {
  return sk.split(BFGID_SEPARATOR)[1] as BfGid;
}

export function pkToBfGids(pk: BfPk | string): BfGid[] {
  if (pk.includes(OWNER_PARENT_SEPARATOR)) {
    return pk.split(OWNER_PARENT_SEPARATOR).map(toBfGid);
  }
  return [pk as BfGid];
}

export enum ACCOUNT_ACTIONS {
  READ = "READ",
  WRITE = "WRITE",
  CREATE = "CREATE",
  DELETE = "DELETE",
  LIST = "LIST",
  UPDATE = "UPDATE",
  REFRESH_CREDENTIALS = "REFRESH_CREDENTIALS",
  TRANSFER_OWNERSHIP = "TRANSFER_OWNERSHIP",
  INVITE = "INVITE",
}

export enum ACCOUNT_ROLE {
  ADMIN = "ADMIN",
  ANON = "ANON",
  OWNER = "OWNER",
  OMNI = "OMNI",
  REFRESH_CREDENTIALS_ONLY = "REFRESH_CREDENTIALS_ONLY",
  SERVICE_INGESTION = "SERVICE_INGESTION",
}

const ADMIN_ACTIONS = [
  ACCOUNT_ACTIONS.READ,
  ACCOUNT_ACTIONS.WRITE,
  ACCOUNT_ACTIONS.CREATE,
  ACCOUNT_ACTIONS.DELETE,
  ACCOUNT_ACTIONS.LIST,
  ACCOUNT_ACTIONS.UPDATE,
  ACCOUNT_ACTIONS.INVITE,
];
const OWNER_ACTIONS = [
  ...ADMIN_ACTIONS,
  ACCOUNT_ACTIONS.TRANSFER_OWNERSHIP,
];

const OMNI_ACTIONS = [
  ...OWNER_ACTIONS,
  ACCOUNT_ACTIONS.CREATE_ORGANIZATION,
  ACCOUNT_ACTIONS.CREATE_USER,
];

const roleToActions: Record<ACCOUNT_ROLE, ACCOUNT_ACTIONS[]> = {
  [ACCOUNT_ROLE.ADMIN]: ADMIN_ACTIONS,
  [ACCOUNT_ROLE.OWNER]: OWNER_ACTIONS,
  [ACCOUNT_ROLE.SERVICE_INGESTION]: [
    ACCOUNT_ACTIONS.READ,
    ACCOUNT_ACTIONS.WRITE,
  ],
  [ACCOUNT_ROLE.ANON]: [],
  [ACCOUNT_ROLE.REFRESH_CREDENTIALS_ONLY]: [
    ACCOUNT_ACTIONS.REFRESH_CREDENTIALS,
    ACCOUNT_ACTIONS.READ,
  ],
  [ACCOUNT_ROLE.OMNI]: OMNI_ACTIONS,
};

export function getAvailableActionsForRole(
  role: ACCOUNT_ROLE,
): Array<ACCOUNT_ACTIONS> {
  const actions = roleToActions[role];
  return actions ?? [];
}
