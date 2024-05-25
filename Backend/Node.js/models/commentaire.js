import { model, Schema } from "mongoose";

const CommentaireSchema = new Schema(
  {
    sender: String,
    receiver: String,
    content: String
  },
  { timestamps: true }
);

export default model("Commentaire", CommentaireSchema);

