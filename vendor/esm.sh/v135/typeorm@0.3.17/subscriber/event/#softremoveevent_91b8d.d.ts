import { RemoveEvent } from "./RemoveEvent.d.ts";
/**
 * SoftRemoveEvent is an object that broadcaster sends to the entity subscriber when entity is being soft removed to the database.
 */
export interface SoftRemoveEvent<Entity> extends RemoveEvent<Entity> {
}
