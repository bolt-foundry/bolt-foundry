import { ObjectLiteral } from "../common/ObjectLiteral.d.ts";
import { EntityManager } from "../entity-manager/EntityManager.d.ts";
import { Repository } from "./Repository.d.ts";
import { TreeRepository } from "./TreeRepository.d.ts";
import { ObjectType } from "../common/ObjectType.d.ts";
import { SelectQueryBuilder } from "../query-builder/SelectQueryBuilder.d.ts";
/**
 * Provides abstract class for custom repositories that do not inherit from original orm Repository.
 * Contains all most-necessary methods to simplify code in the custom repository.
 * All methods are protected thus not exposed and it allows to create encapsulated custom repository.
 *
 * @deprecated use Repository.extend function to create a custom repository
 */
export declare class AbstractRepository<Entity extends ObjectLiteral> {
    /**
     * Gets entity manager that allows to perform repository operations with any entity.
     */
    protected manager: EntityManager;
    /**
     * Gets the original ORM repository for the entity that is managed by this repository.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected get repository(): Repository<Entity>;
    /**
     * Gets the original ORM tree repository for the entity that is managed by this repository.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected get treeRepository(): TreeRepository<Entity>;
    /**
     * Creates a new query builder for the repository's entity that can be used to build a SQL query.
     * If current repository does not manage any entity, then exception will be thrown.
     */
    protected createQueryBuilder(alias: string): SelectQueryBuilder<Entity>;
    /**
     * Creates a new query builder for the given entity that can be used to build a SQL query.
     */
    protected createQueryBuilderFor<T extends ObjectLiteral>(entity: ObjectType<T>, alias: string): SelectQueryBuilder<T>;
    /**
     * Gets the original ORM repository for the given entity class.
     */
    protected getRepositoryFor<T extends ObjectLiteral>(entity: ObjectType<T>): Repository<T>;
    /**
     * Gets the original ORM tree repository for the given entity class.
     */
    protected getTreeRepositoryFor<T extends ObjectLiteral>(entity: ObjectType<T>): TreeRepository<T>;
    /**
     * Gets custom repository's managed entity.
     * If given custom repository does not manage any entity then undefined will be returned.
     */
    private getCustomRepositoryTarget;
}
