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
 */
export const users = mysqlTable("users", {

  id: int("id")
    .autoincrement()
    .primaryKey(),


  openId: varchar("openId", {
    length: 64,
  })
    .notNull()
    .unique(),


  name: text("name"),


  email: varchar("email", {
    length: 320,
  }),


  loginMethod: varchar("loginMethod", {
    length: 64,
  }),


  role: mysqlEnum(
    "role",
    [
      "user",
      "admin",
    ]
  )
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



export type User =
  typeof users.$inferSelect;


export type InsertUser =
  typeof users.$inferInsert;





/**
 * User music preference
 *
 * 로그인 사용자만 저장
 *
 * guest:
 * - sessionStorage 사용
 * - DB 저장 X
 */
export const userPreferences = mysqlTable(
  "user_preferences",
  {

    id: int("id")
      .autoincrement()
      .primaryKey(),


    userId: int("userId")
      .notNull(),


    genres: text("genres")
      .notNull(),


    moods: text("moods")
      .notNull(),


    createdAt: timestamp("createdAt")
      .defaultNow()
      .notNull(),


    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .onUpdateNow()
      .notNull(),

  }
);



export type UserPreference =
  typeof userPreferences.$inferSelect;


export type InsertUserPreference =
  typeof userPreferences.$inferInsert;
