import { DirectiveDefinitionNode, InterfaceTypeDefinitionNode, InterfaceTypeExtensionNode } from 'graphql';
import { Config } from './merge-typedefs.cjs';
export declare function mergeInterface(node: InterfaceTypeDefinitionNode | InterfaceTypeExtensionNode, existingNode: InterfaceTypeDefinitionNode | InterfaceTypeExtensionNode, config?: Config, directives?: Record<string, DirectiveDefinitionNode>): InterfaceTypeDefinitionNode | InterfaceTypeExtensionNode;
