// server/routes/cart.routes.js
const express = require('express');
const { CartItem, Product } = require('../database/models');
const { verifyToken } = require('../utils/token.js');

const router = express.Router();

// CREATE CartItem
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId; 
        const { productId, quantity } = req.body;

        if (!productId || isNaN(productId)) {
            return res.status(400).json({ success: false, message: 'Product id is not valid', data: {} });
        }

        if (!quantity || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be a positive number', data: {} });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        }

        let cartItem = await CartItem.findOne({
            where: { userId, productId }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();

            return res.status(200).json({
                success: true,
                message: 'Cart item updated successfully',
                data: cartItem
            });
        }

        cartItem = await CartItem.create({
            userId,
            productId,
            quantity
        });

        res.status(201).json({
            success: true,
            message: 'Cart item created successfully',
            data: cartItem
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating cart item', data: error.message });
    }
});


// DELETE CartItem
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Cart item id is not valid', data: {} });
        }

        const cartItem = await CartItem.findByPk(id);

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found', data: {} });
        }

        if (cartItem.userId !== req.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized', data: {} });
        }

        await cartItem.destroy();

        res.status(200).json({
            success: true,
            message: 'Cart item successfully deleted',
            data: {}
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting cart item', data: error.message });
    }
});


// GET the CartItems (for logged user)
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        const items = await CartItem.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                }
            ]
        });

        if (items.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Cart is empty',
                data: { items: [], totalCost: 0 }
            });
        }

        // Shopping Cart total
        const totalCost = items.reduce((sum, item) => {
            return sum + item.quantity * item.Product.price;
        }, 0);

        res.status(200).json({
            success: true,
            message: 'Cart items retrieved successfully',
            data: { items, totalCost }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving cart items',
            data: error.message
        });
    }
});

// GET CartItem BY id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Cart item id is not valid', data: {} });
        }

        const cartItem = await CartItem.findByPk(id, {
            include: [Product]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
                data: {}
            });
        }

        if (cartItem.userId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized',
                data: {}
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cart item was found',
            data: cartItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving cart item',
            data: error.message
        });
    }
});


// UPDATE CartItem (modify quantity)
router.put('/:id', verifyToken, async (req, res) => {
    console.log("req.userId =", req.userId);
    try {
        const id = req.params.id;
        const { quantity } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Cart item id is not valid',
                data: {}
            });
        }

        if (!quantity || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive number',
                data: {}
            });
        }

        const cartItem = await CartItem.findByPk(id);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
                data: {}
            });
        }

        if (cartItem.userId !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized',
                data: {}
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            success: true,
            message: 'Cart item quantity updated successfully',
            data: cartItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating cart item',
            data: error.message
        });
    }
});



module.exports = router;