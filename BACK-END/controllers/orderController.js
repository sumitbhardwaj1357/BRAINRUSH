const supabase = require("../config/supabaseClient");

exports.placeOrder = async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      city,
      address,
      items,
      total,
      payment_method,
    } = req.body;

    const uniqueNumber = Date.now().toString().slice(-5);

    const orderCode = `ORD${uniqueNumber}`;

    const { data, error } = await supabase.from("orders").insert([
      {
        order_code: orderCode,

        customer_name,

        phone,

        city,

        address,

        items,

        total,

        payment_method,

        status: "Received",
      },
    ]);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Order Placed",

      order_code: orderCode,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase

      .from("orders")

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
      message: err.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { phone } = req.params;

    const { data, error } = await supabase

      .from("orders")

      .select("*")
      .ilike("phone", `%${phone}%`)

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
      message: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const { error } = await supabase

      .from("orders")

      .update({
        status,
      })

      .eq("id", id);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(200).json({
      message: "Status Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
