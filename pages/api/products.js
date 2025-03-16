import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect()
    console.log(req.query)
    if(method === 'GET'){
        if(req.query?.name){
          const products = await Product.findOne({title:{ $regex: req.query?.name, $options: 'i' } })
          console.log(req.query?.name)
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


      }
} 