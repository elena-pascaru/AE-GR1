// server/database/models/index.js
const User = require('./User');
const Product = require('./Product');
const CartItem = require('./CartItem');


// Associations
// user -> cartitem
User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// product -> cartitem
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { User, Product, CartItem };
