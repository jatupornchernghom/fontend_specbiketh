// api/category.js
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method, query } = req;
  await mongooseConnect();

  if (method === 'GET') {
    const result = await Category.findOne({ _id: query.id });
    

    res.json(result);
  }
}
