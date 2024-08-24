import { ColumnMetadata } from "../../metadata/ColumnMetadata.d.ts";
import { RelationMetadata } from "../../metadata/RelationMetadata.d.ts";
import { EntityManager } from "../../entity-manager/EntityManager.d.ts";
import { QueryRunner } from "../../query-runner/QueryRunner.d.ts";
import { DataSource } from "../../data-source/DataSource.d.ts";
import { EntityMetadata } from "../../metadata/EntityMetadata.d.ts";
import { ObjectLiteral } from "../../common/ObjectLiteral.d.ts";
/**
 * UpdateEvent is an object that broadcaster sends to the entity subscriber when entity is being updated in the database.
 */
export interface UpdateEvent<Entity> {
    /**
     * Connection used in the event.
     */
    connection: DataSource;
    /**
     * QueryRunner used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this query runner instance.
     */
    queryRunner: QueryRunner;
    /**
     * EntityManager used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this entity manager instance.
     */
    manager: EntityManager;
    /**
     * Updating entity.
     */
    entity: ObjectLiteral | undefined;
    /**
     * Metadata of the entity.
     */
    metadata: EntityMetadata;
    /**
     * Updating entity in the database.
     */
    databaseEntity: Entity;
    /**
     * List of updated columns. In query builder has no affected
     */
    updatedColumns: ColumnMetadata[];
    /**
     * List of updated relations. In query builder has no affected
     */
    updatedRelations: RelationMetadata[];
}
