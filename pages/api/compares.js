import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  switch (method) {
    case 'GET':

      try {
        let allProducts, category;
          // If id is not present, fetch all products and categories
          allProducts = await Product.find({});
          category = await Category.find({ parent: { $ne: null } });
      
        const result = {
          allProducts,
          category
        };
      
        res.status(200).json(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
