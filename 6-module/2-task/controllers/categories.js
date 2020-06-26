const Categories = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {

  const categories = await Categories.find({});
  const result = [];
  categories.forEach(cat => {
    const subcategories = [];
    cat.subcategories.forEach(sub => {
      const subcategory = {
        id: sub._id,
        title: sub.title,
      };
      subcategories.push(subcategory);
    })
    const category = {
      id: cat._id,
      title: cat.title,
      subcategories: subcategories,
    };    
    result.push(category);
  });
  ctx.body = { categories: result };
};
