import { mongooseConnect } from "@/lib/mongoose";
import { Login } from "@/models/Login";

export default async function handler(req, res) {
  await mongooseConnect();

  const { email } = req.body;

  console.log(req.body)

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await Login.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json(user.favorites); // Return favorite IDs
  }

  if (req.method === "POST") {
    const { productId } = req.body;
    const isFav = user.favorites.includes(productId);

    if (isFav) {
      await Login.findByIdAndUpdate(user._id, { $pull: { favorites: productId } });
    } else {
      await Login.findByIdAndUpdate(user._id, { $addToSet: { favorites: productId } });
    }

    return res.status(200).json({ success: true });
  }
}
