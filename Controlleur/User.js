import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { Meme } from "../models/Memes.js";

// Upload d'image
export const Upload = async (req, res) => {
    try {
        console.log('File received:', req.file); // Vérifiez si le fichier arrive
      if (!req.file) {
        return res.status(400).json({ error: 'Aucune image fournie' });
      }
  
      // Upload vers Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: 'image',
            folder: 'meme-generator'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
  
      res.json({
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      res.status(500).json({ error: 'Erreur lors de l\'upload' });
    }
  };
  
  // Créer un meme
export const AddMeme = async (req, res) => {
    try {
      const { title, imageUrl, topText, bottomText, cloudinaryId } = req.body;
      
      if (!title || !imageUrl || !cloudinaryId) {
        return res.status(400).json({ error: 'Données manquantes' });
      }
  
      const meme = new Meme({
        title,
        imageUrl,
        topText,
        bottomText,
        cloudinaryId
      });
  
      await meme.save();
      res.status(201).json(meme);
    } catch (error) {
      console.error('Erreur création meme:', error);
      res.status(500).json({ error: 'Erreur lors de la création' });
    }
  };
  
  // Récupérer tous les memes
  export const GetMemes = async (req, res) => {
    try {
      const memes = await Meme.find().sort({ createdAt: -1 });
      res.json(memes);
    } catch (error) {
      console.error('Erreur récupération memes:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  };
  
  // Récupérer un meme par ID
  export const GetMemes_id = async (req, res) => {
    try {
      const meme = await Meme.findById(req.params.id);
      if (!meme) {
        return res.status(404).json({ error: 'meme non trouvé' });
      }
      res.json(meme);
    } catch (error) {
      console.error('Erreur récupération meme:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  };
  
  // Supprimer un meme
  export const DelMemes = async (req, res) => {
    try {
      const meme = await Meme.findById(req.params.id);
      if (!meme) {
        return res.status(404).json({ error: 'meme non trouvé' });
      }
  
      // Supprimer l'image de Cloudinary
      await cloudinary.uploader.destroy(meme.cloudinaryId);

      // Supprimer le meme de la base de données
      await Meme.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'meme supprimé avec succès' });
    } catch (error) {
      console.error('Erreur suppression meme:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  };

