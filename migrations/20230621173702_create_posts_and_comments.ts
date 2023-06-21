import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasPostsTable = await knex.schema.hasTable("posts");
  const hasCommentsTable = await knex.schema.hasTable("comments");

  if (!hasPostsTable) {
    await knex.schema.createTable("posts", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.text("content").notNullable();
      table.integer("authorId").unsigned().notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
  }

  if (!hasCommentsTable) {
    await knex.schema.createTable("comments", (table) => {
      table.increments("id").primary();
      table
        .integer("postId")
        .unsigned()
        .notNullable()
        .references("posts.id")
        .onDelete("CASCADE");
      table
        .integer("parentCommentId")
        .unsigned()
        .nullable()
        .references("comments.id")
        .onDelete("CASCADE");
      table.text("content").notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("comments");
  await knex.schema.dropTableIfExists("posts");
}
