import { gameSession, type GameSession, type InsertGameSession } from "@shared/schema";

export interface IStorage {
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: number): Promise<GameSession | undefined>;
}

export class MemStorage implements IStorage {
  private sessions: Map<number, GameSession>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.currentId = 1;
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.currentId++;
    const session: GameSession = { ...insertSession, id };
    this.sessions.set(id, session);
    return session;
  }

  async getGameSession(id: number): Promise<GameSession | undefined> {
    return this.sessions.get(id);
  }
}

export const storage = new MemStorage();
