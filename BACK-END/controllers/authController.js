const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const {
      name,

      email,

      phone,

      password,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { count } = await supabase

      .from("users")

      .select("*", {
        count: "exact",
        head: true,
      });

    const userCount = count || 0;

    const userCode = `BRU${String(userCount + 1).padStart(3, "0")}`;

    const { error } = await supabase

      .from("users")

      .insert([
        {
          user_code: userCode,

          name,

          email,

          phone,

          password: hashedPassword,

          role: "user",
        },
      ]);

    if (error) {
      console.log(error);

      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!data) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, data.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: data.id,
        role: data.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      token,

      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
