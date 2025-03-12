import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect()
    if(method === 'GET'){
        if(req.query?.id){
          const products = await Product.findOne({_id:req.query.id})
          const maxprice = products.price + 4000
          const minprice = products.secondhandprice - 2000
          const recommend = await Product.find({
            price: {
              $gte: minprice,
              $lte: maxprice
            }
          }).limit(4);
                    
          const result = {
            products,
            recommend
          }
          res.json(result)
          
        }else{
            res.json(await Product.find())
        }
    }
    if(method === 'PUT'){
        const { _id, views } = req.body;

        const result = await Product.updateOne({ _id }, { views });
        res.json('555')

      }
} 