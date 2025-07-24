import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSessionSchema } from "@shared/schema";
import multer from "multer";
import * as XLSX from "xlsx";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Parse uploaded files (CSV/XLSX) and extract words
  app.post("/api/parse-file", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname.toLowerCase();
      let words: string[] = [];

      if (fileName.endsWith('.csv')) {
        const csvText = fileBuffer.toString('utf-8');
        words = csvText.split(/[,\n\r]/)
          .map(word => word.trim().toLowerCase())
          .filter(word => word.length > 0 && /^[a-zA-Z]+$/.test(word));
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];
        
        words = data.flat()
          .map(cell => String(cell).trim().toLowerCase())
          .filter(word => word.length > 0 && /^[a-zA-Z]+$/.test(word));
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload CSV or XLSX files." });
      }

      if (words.length === 0) {
        return res.status(400).json({ error: "No valid words found in the file" });
      }

      res.json({ words });
    } catch (error) {
      console.error("File parsing error:", error);
      res.status(500).json({ error: "Failed to parse file" });
    }
  });

  // Save game session results
  app.post("/api/game-sessions", async (req, res) => {
    try {
      const validatedData = insertGameSessionSchema.parse(req.body);
      const session = await storage.createGameSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Game session creation error:", error);
      res.status(400).json({ error: "Invalid game session data" });
    }
  });

  // Get game session
  app.get("/api/game-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getGameSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Game session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Get game session error:", error);
      res.status(500).json({ error: "Failed to get game session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
