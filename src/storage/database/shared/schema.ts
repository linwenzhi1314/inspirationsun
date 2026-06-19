import { pgTable, serial, timestamp, varchar, text, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 文章表
export const articles = pgTable(
	"articles",
	{
		id: serial().primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 255 }).notNull().unique(),
		content: text("content").notNull(),
		excerpt: varchar("excerpt", { length: 500 }),
		cover_image: varchar("cover_image", { length: 500 }),
		category: varchar("category", { length: 50 }).default('signal_capture').notNull(),
		published: boolean("published").default(false).notNull(),
		twitter_post_id: varchar("twitter_post_id", { length: 100 }),
		twitter_posted_at: timestamp("twitter_posted_at", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("articles_slug_idx").on(table.slug),
		index("articles_category_idx").on(table.category),
		index("articles_published_idx").on(table.published),
		index("articles_created_at_idx").on(table.created_at),
	]
);

// 用户信息表（存储 Twitter 认证信息）
export const profiles = pgTable(
	"profiles",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		twitter_id: varchar("twitter_id", { length: 100 }),
		twitter_username: varchar("twitter_username", { length: 100 }),
		twitter_access_token: text("twitter_access_token"),
		twitter_refresh_token: text("twitter_refresh_token"),
		twitter_token_expires_at: timestamp("twitter_token_expires_at", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("profiles_twitter_id_idx").on(table.twitter_id),
	]
);
