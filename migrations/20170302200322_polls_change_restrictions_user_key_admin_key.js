
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('polls', function (table) {
      table.string('user_key', 60).notNullable().alter();
      table.string('admin_key', 60).notNullable().alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('polls', function (table) {
      table.string('user_key', 30).notNullable().alter();
      table.string('admin_key', 30).notNullable().alter();
    })
  ]);
};
