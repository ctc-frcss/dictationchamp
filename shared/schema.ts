import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameSession = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  wordBank: jsonb("word_bank").$type<string[]>().notNull(),
  results: jsonb("results").$type<GameResult[]>().notNull(),
  totalScore: integer("total_score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const gameResultSchema = z.object({
  word: z.string(),
  userAnswer: z.string(),
  correct: z.boolean(),
  hintsUsed: z.boolean(),
});

export const insertGameSessionSchema = createInsertSchema(gameSession).omit({
  id: true,
});

export type GameResult = z.infer<typeof gameResultSchema>;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSession.$inferSelect;
