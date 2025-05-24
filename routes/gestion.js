import express from "express";
import multer from "multer";
import { Upload,AddMeme, DelMemes, GetMemes, GetMemes_id } from "../Controlleur/User.js";

const gestion = express.Router();

// Configuration multer pour upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

// Upload d'image
gestion.post('/upload', upload.single('image'), Upload);
  
// Créer un meme
gestion.post('/memes', AddMeme);

// Récupérer tous les memes
gestion.get('/memes', GetMemes);

// Récupérer un meme par ID
gestion.get('/memes/:id', GetMemes_id);

// Supprimer un meme
gestion.delete('/memes/:id', DelMemes);

export default gestion;