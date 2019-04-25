/**
 * Copyright (c) 2018-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


interface SQL {
    add(line: Array<Object> | Object): this,

    getLines(): Array<string>,

    getSize(): number
}

interface DifferOptions {
    dbConfig: object,
    schemaFolder?: string,
    seedFolder?: string,
    logging?: boolean | Function,
    force?: boolean,
    placeholders?: { [key: string]: string; },
}

interface ReferenceOptions {
    table: string,
    columns: Array<string>,
}

declare type ActionType = 'CASCADE' | 'RESTRICT' | 'NO ACTION'

declare type ExtensionType = 'primaryKey' | 'index' | 'foreignKey' | 'unique'

declare type ColumnValueType = string | number | Array<any> | Object

interface ForeignKeyOptions {
    columns: Array<string>
    match?: string,
    onDelete?: ActionType,
    onUpdate?: ActionType,
    references?: ReferenceOptions
}

interface ColumnOptions {
    name: string,
    type: string,
    nullable?: boolean,
    force?: boolean,
    primaryKey?: boolean,
    unique?: boolean,
    default?: ColumnValueType,
    autoIncrement?: boolean | SequenceOptions,
    formerNames?: Array<string>,
}

interface IndexOptions {
    columns: Array<string>,
}

interface SequenceOptions {
    name?: string,
    start?: string | number,
    min?: string | number,
    max?: string | number,
    increment?: string | number,
    cycle?: boolean,
}

interface TableOptions {
    name: string,
    columns: Array<ColumnOptions>,
    force?: boolean,
    foreignKeys?: Array<ForeignKeyOptions>,
    primaryKeys?,
    unique?,
    indexes?: Array<IndexOptions>,
    seeds?: Array<Object>,
    forceExtensions?: Array<ExtensionType>,
}

interface Schema {
    type: string,
    properties: TableOptions | SequenceOptions
}

interface Model {
    // public methods
    addSeeds(seeds: Array<Object>): null

    // private methods
    _getSqlCreateOrAlterTable(): Promise<SQL>

    _getSqlExtensionChanges(): Promise<SQL>

    _getSchema(): Object

    _getSqlInsertSeeds(): SQL
}

declare class Differ {
    constructor(options: DifferOptions);

    getModel(name: string): Model | undefined

    define(schema: Schema): Model

    sync(): Promise<null>
}

export = Differ;
