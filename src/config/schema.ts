import { pgTable, serial, varchar, integer, timestamp, text, json } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  credits: integer('credits').default(5)
});

export const projectTable = pgTable('project', {
  id: serial('id').primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }),
  userInput: varchar('user_input', { length: 2000 }),
  device: varchar('device', { length: 50 }),
  projectName: varchar('project_name', { length: 255 }),
  theme: varchar('theme', { length: 255 }),
  projectVisualDescription: text('project_visual_description'),
  screenshot: text('screenshot'),
  config: json('config'),
  createdOn: timestamp('created_on').defaultNow()
});

export const screenConfigTable = pgTable('screen_config', {
  id: serial('id').primaryKey(),
  projectId: varchar('project_id', { length: 255 }),
  screenId: varchar('screen_id', { length: 255 }),
  screenName: varchar('screen_name', { length: 255 }),
  purpose: varchar('purpose', { length: 500 }),
  screenDescription: text('screen_description'),
  code: text('code')
});
