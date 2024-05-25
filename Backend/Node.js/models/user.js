import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: String,
    pseudo: String,
    password: String,
    listFriends : Array
  },
  { timestamps: true }
);

export default model("User", UserSchema);