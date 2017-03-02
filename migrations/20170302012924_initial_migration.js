
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments();
      table.string('email').notNullable();
    }),

    knex.schema.createTable('polls', function (table) {
      table.increments();
      table.integer('user_id').references('id').inTable('users');
      table.string('question', 140).notNullable();
      table.date('end_date');
      table.string('user_key', 30).notNullable();
      table.string('admin_key', 30).notNullable();
      table.boolean('open').defaultTo(true);
    }),

    knex.schema.createTable('choices', function (table) {
      table.increments();
      table.integer('poll_id').references('id').inTable('polls');
      table.string('choice_title', 140).notNullable();
      table.string('description', 140);
      table.unique(['poll_id', 'choice_title']);
    }),

    knex.schema.createTable('answers', function (table) {
      table.increments();
      table.integer('choice_id').references('id').inTable('choices');
      table.integer('points').notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('polls'),
    knex.schema.dropTable('choices'),
    knex.schema.dropTable('answers')
  ]);
};
