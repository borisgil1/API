
const CartRepository = require("../repository/cart.repository.js");
const ProductsModel = require("../models/products.model.js");
const cartRepository = new CartRepository();
const UserDTO = require("../dto/user.dto.js");


//Vista productos
class viewsController {

    async renderProducts(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        try {
            const products = await ProductsModel.paginate({}, { limit, page });
            const final = products.docs.map(products => {
                const { _id, ...rest } = products.toObject();
                return { _id, ...rest };
            })

            //Paso el user DTO a la vista
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role, req.user.cart.toString(), req.user.age);

            res.render("products", {
                products: final,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages,
                user: userDto,
            });

        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" + error });
        }
    };

    //vista cart, muestra los productos que tiene cada carrito
    async renderCart(req, res) {
        let cid = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cid);
            if (cart) {

                // Calcular el precio total del carrito
                let totalPrice = 0;
                cart.products.forEach(item => {
                    totalPrice += item.product.price * item.quantity;
                });
                totalPrice = parseFloat(totalPrice.toFixed(2)); // Redondear a dos decimales

                // Renderizar la vista de carrito con los datos del carrito
                const productsInCar = cart.products.map(item => ({
                     //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
                    product: item.product.toObject(),
                    quantity: item.quantity,
                    productId: item.product._id, 
                }));

                //Guardo en variable el cartId y el correo del usuario
                const cartId = req.user.cart.toString();
                const email = req.user.email;
                
                res.render("carts", { products: productsInCar, totalPrice, cartId, email,});

            } else {
                return res.status(404).send("Carrito no encontrado")
            }
        } catch (error) {
            console.error("Error al mostrar carrito", error);
            return res.status(500).send("Error al mostrar carrito");
        }
    };

    async login(req, res) {
        res.render("login");
    }


    async chat(req, res) {
        res.render("chat");
    };

    async register(req, res) {
        res.render("register");
    }

    async home(req, res) {
        res.render("home");
    };


    async admin(req, res) {
        // Verificar si no hay usuario en la sesión o si el rol del usuario no es "admin"
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send("Acceso denegado, no eres admin");
        }
        res.render("admin");
    };


    async realTime(req, res) {
        res.render("realtimeproducts");
    };

    async recover(req, res) {
        res.render("recover");
    };

    async contact(req, res) {
        res.render("contact");
    };

    async profile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role, req.user.cart, req.user.age);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    //     async profile(req, res) {
    //         const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
    //         const admin = req.user.role === "admin";
    //         res.render("profile", { user: userDto, admin });
    //     }
}

module.exports = viewsController;