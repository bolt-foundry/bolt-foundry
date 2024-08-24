import { ObjectType } from "./ObjectType.d.ts";
import { EntitySchema } from "../index.d.ts";
/**
 * Entity target.
 */
export type EntityTarget<Entity> = ObjectType<Entity> | EntitySchema<Entity> | string | {
    type: Entity;
    name: string;
};
