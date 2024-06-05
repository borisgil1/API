//Router: Conecta los metodos del controller con los diferentes endpoints

const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController;

//Crear carrito
router.post("/", cartController.createCart);
 
//Mostrar carrito por ID
router.get("/:cid", cartController.getCartById);

//Mostrar todos los carritos
router.get("/", cartController.getCarts);

//Agregar productos a carritos
router.post("/:cid/products/:pid", cartController.addProductToCart);

//Eliminar producto de carrito
router.delete("/:cid/products/:pid", cartController.deleteCartProduct);

//Actualizar productos del carrito
router.put("/:id", cartController.updateCartProducts )

//Actualizar cantidad de productos del carrito
router.put("/:cid/products/:pid", cartController.updateQuantity)

//Vaciar carrito
router.delete("/:cid", cartController.emptyCart );

module.exports = router;