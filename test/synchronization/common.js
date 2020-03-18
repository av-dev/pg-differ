'use strict';

const helpers = require('../helpers');

exports.describeIndexOrConstraintTest = (type, firstStage, secondStage) => {
  const title = type
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2')
    .toLowerCase();
  describe(title, () => {
    it(`should create a table and add '${title}'`, function() {
      return helpers.alterObject(
        'table',
        {
          properties: firstStage.properties.map(props => ({
            name: props.name,
            columns: props.columns,
          })),
          syncOptions: { force: true },
          ignoreResultCheck: true,
        },
        {
          properties: firstStage.properties,
          expectQueries: firstStage.expectQueries,
        }
      );
    });

    it(`should drop unnecessary '${title}'`, function() {
      const cleanable = { [type]: true };
      return helpers.alterObject(
        'table',
        {
          properties: firstStage.properties,
          syncOptions: { force: true },
          ignoreResultCheck: true,
        },
        {
          properties: firstStage.properties,
          syncOptions: { cleanable },
          expectQueries: [],
        },
        {
          properties: secondStage.properties,
          syncOptions: { cleanable },
          expectQueries: secondStage.expectQueries,
        }
      );
    });
  });
};
