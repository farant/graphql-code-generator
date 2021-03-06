import { GraphQLObjectType } from 'graphql/type/definition';
import { GraphQLField } from 'graphql/type/definition';
import { GraphQLType } from 'graphql/type/definition';
import { Model } from '../models/interfaces';
import { GraphQLSchema } from 'graphql/type/schema';
import { OperationDefinitionNode } from 'graphql/language/ast';
export declare const isPrimitive: (primitivesMap: any, type: string) => any;
export declare const shouldSkip: (typeName: string) => boolean;
export declare const isRequired: (type: GraphQLType) => boolean;
export declare const isArray: (type: GraphQLType) => boolean;
export declare const getTypeName: (primitivesMap: any, type: GraphQLType) => any;
export declare function getFieldDef(parentType: any, fieldAST: any): GraphQLField<any, any>;
export declare const handleNameDuplications: (name: string, existing: Model[]) => string;
export declare const getRoot: (schema: GraphQLSchema, operation: OperationDefinitionNode) => GraphQLObjectType;
export declare const buildName: (typesMap: any, name: string, type: string) => string;
