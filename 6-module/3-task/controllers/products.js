const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;
  if(query){
    // const queryText = ctx.request.query.query;
    const products = await Products.find({ $text: { $search: query } });
    ctx.body = {
      products: products
    };
  }else{
    ctx.body = {
      products: []
    }
  }
};
