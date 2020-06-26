const Categories = require('../models/Category');
const Products = require('../models/Product');
//const { ObjectId } = require('mongoose'); // Данный вариант не работает (node v14.4.0)
const mongoose = require('mongoose');


const prepareProducts = (ps) => {
  return ps.map(prod => {
    return {
      id: prod._id,
      title: prod.title,
      images: prod.images,
      category: prod.category,
      subcategory: prod.subcategory,
      price: prod.price,
      description: prod.description,
    };
  })
}


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const id = ctx.request.query.subcategory;
  let products = [];
  if(id){
    products = await Products.find({
      subcategory: id,
    });
    ctx.body = {
      products: prepareProducts(products),
    }
  }else{
    return next();
  }
  
};


module.exports.productList = async function productList(ctx, next) {
  const products = await Products.find({});
  ctx.body = {
    products: prepareProducts(products),
  }
};

module.exports.productById = async function productById(ctx, next) {  
  const url = ctx.request.url;
  const id = url.slice(url.lastIndexOf('/') + 1)

  if(mongoose.Types.ObjectId.isValid(id)){
    if(mongoose.Types.ObjectId(id) == id){

      const pd = await Products.findOne({
        _id: id,
      });

      if(pd === null){
        ctx.status = 404;
        ctx.body = 'No data...';
      }else{
        const product = {
          id: pd.id,
          title: pd.title,
          images: pd.images,
          category: pd.category,
          subcategory: pd.subcategory,
          price: pd.price,
          description: pd.description,
        };
  
        ctx.body = {
          product: product,
        };  
      }
    }
    return;
  }

  ctx.status = 400;
  ctx.body = 'Id is invalid!';

};

