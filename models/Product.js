import mongoose, { model, Schema,models } from 'mongoose';


const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    secondhandprice: {type: Number},
    images: [{ type: String }],
    category: {type:mongoose.Types.ObjectId,ref:'Category'},
    properties: {type:Object},
    views: {type: Number},
  },{
    timestamps: true,
    
  });

  export const Product = models.Product || model('Product', ProductSchema);



