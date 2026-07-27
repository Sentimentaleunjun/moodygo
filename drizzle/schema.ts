import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Users table
 * Authentication / account information
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),

  openId: varchar("openId", { length: 64 })
    .notNull()
    .unique(),

  name: text("name"),

  email: varchar("email", { length: 320 }),

  loginMethod: varchar("loginMethod", { length: 64 }),

  role: mysqlEnum("role", ["user", "admin"])
    .default("user")
    .notNull(),

  createdAt: timestamp("createdAt")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .onUpdateNow()
    .notNull(),

  lastSignedIn: timestamp("lastSignedIn")
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;


/**
 * User music preferences
 * 가입 시 선택한 장르 / 분위기 저장
 */
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id")
    .autoincrement()
    .primaryKey(),

  userId: int("userId")
    .notNull(),

  // JSON 형태 저장
  // 예: ["J-POP","K-POP","R&B"]
  genres: text("genres"),

  // JSON 형태 저장
  // 예: ["calm","happy"]
  moods: text("moods"),

  createdAt: timestamp("createdAt")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export type UserPreference =
  typeof userPreferences.$inferSelect;


/**
 * Music recommendation history
 * 로그인 사용자 추천 기록
 */
export const musicHistory = mysqlTable("music_history", {
  id: int("id")
    .autoincrement()
    .primaryKey(),

  userId: int("userId")
    .notNull(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  artist: varchar("artist", {
    length: 255,
  }).notNull(),

  youtubeId: varchar("youtubeId", {
    length: 100,
  }),

  mood: varchar("mood", {
    length: 50,
  }).notNull(),

  createdAt: timestamp("createdAt")
    .defaultNow()
    .notNull(),
});

export type MusicHistory =
  typeof musicHistory.$inferSelect;


/**
 * User liked songs
 * 좋아요한 곡 저장
 */
export const likedSongs = mysqlTable("liked_songs", {
  id: int("id")
    .autoincrement()
    .primaryKey(),

  userId: int("userId")
    .notNull(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  artist: varchar("artist", {
    length: 255,
  }).notNull(),

  youtubeId: varchar("youtubeId", {
    length: 100,
  }),

  createdAt: timestamp("createdAt")
    .defaultNow()
    .notNull(),
});

export type LikedSong =
  typeof likedSongs.$inferSelect;
