import express from "express";
import mongoose from "mongoose";

const memeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  topText: { type: String, default: '' },
  bottomText: { type: String, default: '' },
  cloudinaryId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Meme = mongoose.model('Meme', memeSchema);