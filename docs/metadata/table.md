# Table

## Usage example {docsify-ignore}

```javascript
const differ = new Differ();
differ.define('table', properties);
differ.sync().then(() => console.log('database ready'));
```

## Properties

### name

- Type: `String`
- Default: `null`
- Required: `true`

The name of the format table is `'schema_name.table_name'` or `'table_name'`

### columns

- Type: `Object<{[name]: Column}>`
- Default: `null`
- Required: `true`

[Table columns](metadata/column.md)

### primaryKey

- Type: `Object`
- Default: `null`
- Required: `false`

[Object with parameters](metadata/primary-key.md) of table primary key

### indexes

- Type: `Object[]`
- Default: `null`
- Required: `false`

Array of objects with parameters of table indexes

### foreignKeys

- Type: `Object[]`
- Default: `null`
- Required: `false`

Array of [objects with parameters](metadata/foreign-key.md) of table foreign keys

### unique

- Type: `Object[]`
- Default: `null`
- Required: `false`

Array of [objects with parameters](metadata/unique.md) of table unique

### checks

- Type: `Object[]`
- Default: `null`
- Required: `false`

Array of [objects with parameters](metadata/check.md) of table checks