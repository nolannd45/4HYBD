import { model, Schema } from "mongoose";

const GroupSchema = new Schema(
  {
    titre: String,
    users: Array,
    lastMessage: {type: String, default: "Groupe crée"},
  },
  { timestamps: true }
);

export default model("Group", GroupSchema);