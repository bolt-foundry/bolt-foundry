import { FindOneOptions } from "../FindOneOptions.d.ts";
import { ObjectLiteral } from "../../common/ObjectLiteral.d.ts";
/**
 * Defines a special criteria to find specific entity.
 */
export type MongoFindOneOptions<Entity = any> = Omit<FindOneOptions<Entity>, "where"> & {
    /**
     * Simple condition that should be applied to match entities.
     */
    where?: FindOneOptions<Entity>["where"] | ObjectLiteral;
};
