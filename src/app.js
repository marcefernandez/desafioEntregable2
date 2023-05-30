import express from "express";
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/CartManager.js";

const productManager = new ProductManager("./productos.json");
const cartManager = new CartManager("./carritos.json");

const app = express();

app.use(express.json());

app.get("/api/products", (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getProducts(limit);
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.post("/api/products", (req, res) => {
  const { title, description, price, stock, thumbnails } = req.body;
  productManager.addProduct(title, description, price, stock, thumbnails);
  res.sendStatus(201);
});

app.put("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  productManager.updateProduct(productId, updatedProduct);
  res.sendStatus(200);
});

app.delete("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  productManager.deleteProduct(productId);
  res.sendStatus(200);
});

app.post("/api/carts", (req, res) => {
  const cart = cartManager.createCart([]);
  res.status(201).json({ id: cart.id, message: "Carrito creado exitosamente" });
});

app.get("/api/carts", (req, res) => {
  const carts = cartManager.getAllCarts();
  res.json(carts);
});

app.get("/api/carts/:id", (req, res) => {
  const cartId = req.params.id;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

app.post("/api/carts/:id/products/:productId", (req, res) => {
  const cartId = req.params.id;
  const productId = parseInt(req.params.productId);
  cartManager.addToCart(cartId, productId);
  res.sendStatus(200);
});

app.delete("/api/carts/:id/products/:productId", (req, res) => {
  const cartId = req.params.id;
  const productId = parseInt(req.params.productId);
  cartManager.removeFromCart(cartId, productId);
  res.sendStatus(200);
});
