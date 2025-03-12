import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        try {
            const category = await Category.findOne({ name: req.query.name });

            if (category) {
                // Assuming you have a field named 'categoryId' in your Product schema
                const productsInCategory = await Product.find({ category: category._id });

                res.json(productsInCategory);
            } else {
                res.status(404).json({ message: "Category not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}
