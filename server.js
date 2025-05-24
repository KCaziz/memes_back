import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
dotenv.config();
import gestion from "./routes/gestion.js"

const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.MONGODB_URI

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://memes.az-tenders.com'],
  credentials: true
}));

app.use(express.json());

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Gestion des erreurs
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }
  }
  res.status(500).json({ error: error.message || 'Erreur serveur' });
});


// Routes
app.use("/api", gestion);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening to port :${PORT}`);
    });
    console.log("App connected to DataBase");
  })
  .catch((error) => {
    console.log(error);
  });

  // Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});
