const supabase = require("../config/supabaseClient");

/* ========================= */
/* ADD PRODUCT */
/* ========================= */

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      old_price,
      category,
      badge,
      flavors,
      description,
      image,
    } = req.body;

    const { count } = await supabase.from("products").select("*", {
      count: "exact",
      head: true,
    });

    const productCode = `BRP${String(count + 1).padStart(3, "0")}`;

    const { data, error } = await supabase

      .from("products")

      .insert([
        {
          product_code: productCode,

          name,

          price,

          old_price,

          category,

          badge,

          flavors,

          description,

          image,
        },
      ]);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Product Added",

      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ========================= */
/* GET PRODUCTS */
/* ========================= */

exports.getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase

      .from("products")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ========================= */
/* DELETE PRODUCT */
/* ========================= */

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase

      .from("products")

      .delete()

      .eq("id", id);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Product Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      old_price,
      category,
      badge,
      flavors,
      description,
      image,
    } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        price,
        old_price,
        category,
        badge,
        flavors,
        description,
        image,
      })
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Product Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
