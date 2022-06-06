const express = require("express");
const auth = require("../config/auth");
const database = require("../config/database").connect();

const router = express.Router();

router.get("/", auth.isAuthenticated, (req, res) => {
  return res.status(200).render("dashboard/dashboard");
});

router.get("/orders", auth.isAuthenticated, (req, res) => {
  database.query(`CALL viewOrders();`, (err, viewResult) => {
    if (err) {
      console.error(err);
    }
    viewResult = viewResult[0];
    database.query(
      `SELECT product_id, product_name FROM products;`,
      (err, products) => {
        if (err) {
          console.error(err);
        }
        return res
          .status(200)
          .render("dashboard/orders", { viewResult, products });
      }
    );
  });
});

router.get("/products", auth.isAuthenticated, (req, res) => {
  database.query(`CALL viewProducts();`, (err, viewResult) => {
    if (err) {
      console.error(err);
    }
    viewResult = viewResult[0];
    database.query(
      `SELECT product_category_id, product_category_name FROM product_categories;`,
      (err, productCategories) => {
        if (err) {
          console.error(err);
        }
        database.query(
          `SELECT product_brand_id, product_brand_name FROM product_brands;`,
          (err, productBrands) => {
            if (err) {
              console.error(err);
            }
            return res.status(200).render("dashboard/products", {
              viewResult,
              productCategories,
              productBrands,
            });
          }
        );
      }
    );
  });
});

router.post("/orders", (req, res) => {
  const {
    product_id,
    order_ordered_amount,
    order_date,
    customer_name,
    customer_NIP,
  } = req.body;

  // TODO -> input data validation!

  database.query(
    `SELECT product_price FROM products WHERE product_id = ${product_id};`,
    (err, result) => {
      if (err) {
        console.error(err);
      }
      const order_total_price =
        result[0].product_price * parseInt(order_ordered_amount);
      database.query(
        `CALL createOrder('${order_date}', ${parseInt(product_id)}, ${parseInt(
          order_ordered_amount
        )}, ${order_total_price}, '${customer_name}', ${parseInt(
          customer_NIP
        )}, ${req.user});`,
        (err, result) => {
          if (err) {
            console.error(err);
          }
          req.flash("success", "record has been added");
          return res.status(201).redirect("/dashboard/orders");
        }
      );
    }
  );
});

router.post("/products", (req, res) => {
  const {
    product_name,
    product_desc,
    product_price,
    product_amount,
    product_category_id,
    product_brand_id,
  } = req.body;

  if (
    !(
      product_name &&
      product_price &&
      product_amount &&
      product_category_id &&
      product_brand_id
    )
  ) {
    req.flash("error", "please fill in all fields");
    return res.status(400).redirect("/dashboard/products");
  }
  if (product_name.length < 3) {
    req.flash("error", "product name should contain at least 3 characters");
    return res.status(400).redirect("/dashboard/products");
  }
  if (parseFloat(product_price) < 0) {
    req.flash("error", "product price can't be lower than 0");
    return res.status(400).redirect("/dashboard/products");
  }
  if (parseFloat(product_price) > 99999.99) {
    req.flash("error", "product price can't be higher than 99999.99");
    return res.status(400).redirect("/dashboard/products");
  }
  if (parseFloat(product_amount) < 0) {
    req.flash("error", "product amount can't be lower than 0");
    return res.status(400).redirect("/dashboard/products");
  }

  database.query(
    `CALL createProduct('${product_name}', '${product_desc}', ${parseFloat(
      product_price
    )}, ${parseInt(product_amount)}, ${parseInt(
      product_category_id
    )}, ${parseInt(product_brand_id)});`,
    (err, result) => {
      if (err) {
        console.error(err);
      }
      req.flash("success", "record has been added");
      return res.status(201).redirect("/dashboard/products");
    }
  );
});

module.exports = router;
