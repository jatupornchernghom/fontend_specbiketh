import mongoose, { model, models, Schema } from "mongoose";

const LoginSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    profileImage: { type: String } ,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  }, { collection: 'users' });
  


export const Login = models?.Login || model('Login', LoginSchema);

