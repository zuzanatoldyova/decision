
exports.up = function(knex, Promise) {
  return knex.schema.table('answers', function(table) {
    table.string('name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('answers', function(table) {
    table.dropColumn('name');
  });
};