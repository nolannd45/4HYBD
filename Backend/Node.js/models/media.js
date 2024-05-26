import { model, Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    nomFichier: String,
    lienFichier: String,
    receiver: String,
    sender: String,
    story: Boolean,
    latitude: Number,
    longitude: Number,
    vu: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model("Media", MediaSchema);
