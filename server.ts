import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post("/api/parse-mark-sheet-image", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image data provided" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType || "image/jpeg"
            }
          },
          {
            text: "Extract all courses, subjects, course codes, course titles, credits, MST marks, theory/end-sem marks, and total marks from this mark sheet image. Return a JSON array of courses."
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                courseCode: { type: Type.STRING },
                courseName: { type: Type.STRING },
                credits: { type: Type.NUMBER },
                courseType: { type: Type.STRING },
                mst1: { type: Type.NUMBER },
                mst2: { type: Type.NUMBER },
                theory: { type: Type.NUMBER },
                marks: { type: Type.NUMBER }
              },
              required: ["courseCode", "courseName", "credits", "marks"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "Failed to parse mark sheet image" });
      }

      const parsedCourses = JSON.parse(text);
      res.json({ courses: parsedCourses });
    } catch (error: any) {
      console.error("Error parsing mark sheet image:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.post("/api/parse-mark-sheet-text", async (req, res) => {
    try {
      const { textContent } = req.body;
      if (!textContent) {
        return res.status(400).json({ error: "No text or table data provided" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            text: `Extract all courses, subjects, course codes, course titles, credits, MST marks, theory/end-sem marks, and total marks from this pasted mark sheet table or text data:\n\n${textContent}\n\nReturn a JSON array of courses.`
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                courseCode: { type: Type.STRING },
                courseName: { type: Type.STRING },
                credits: { type: Type.NUMBER },
                courseType: { type: Type.STRING },
                mst1: { type: Type.NUMBER },
                mst2: { type: Type.NUMBER },
                theory: { type: Type.NUMBER },
                marks: { type: Type.NUMBER }
              },
              required: ["courseCode", "courseName", "credits", "marks"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "Failed to parse pasted table/text" });
      }

      const parsedCourses = JSON.parse(text);
      res.json({ courses: parsedCourses });
    } catch (error: any) {
      console.error("Error parsing mark sheet text:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
