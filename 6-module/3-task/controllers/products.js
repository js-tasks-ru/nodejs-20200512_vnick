const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const queryText = ctx.request.query.query;

  const products = await Products.find({ $text: { $search: queryText } });

  ctx.body = {
    products: products
  };
};
