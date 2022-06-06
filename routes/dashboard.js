const express = require("express");
const auth = require("../config/auth");
const database = require("../config/database").connect();

const router = express.Router();

router.get("/", auth.isAuthenticated, (req, res) => {
  return res.status(200).render("dashboard/dashboard");
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
      req.flash("success", "one record has been added");
      return res.status(201).redirect("/dashboard/products");
    }
  );
});

module.exports = router;
