import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/mysql-core";


/**
 * Users
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


  createdAt: timestamp(
    "createdAt"
  )
    .defaultNow()
    .notNull(),


  updatedAt: timestamp(
    "updatedAt"
  )
    .defaultNow()
    .onUpdateNow()
    .notNull(),


  lastSignedIn: timestamp(
    "lastSignedIn"
  )
    .defaultNow()
    .notNull(),

});



export type User =
  typeof users.$inferSelect;


export type InsertUser =
  typeof users.$inferInsert;




/**
 * User Music Preferences
 *
 * 사용자가 선택한:
 * - 좋아하는 장르
 * - 좋아하는 분위기
 *
 * 저장
 */
export const userPreferences =
mysqlTable(
  "user_preferences",
  {


    id: int("id")
      .autoincrement()
      .primaryKey(),



    userId: int("userId")
      .notNull()
      .unique(),



    genres: text("genres")
      .notNull(),



    moods: text("moods")
      .notNull(),



    createdAt:
      timestamp("createdAt")
        .defaultNow()
        .notNull(),



    updatedAt:
      timestamp("updatedAt")
        .defaultNow()
        .onUpdateNow()
        .notNull(),


  }
);



export type UserPreference =
  typeof userPreferences.$inferSelect;


export type InsertUserPreference =
  typeof userPreferences.$inferInsert;
