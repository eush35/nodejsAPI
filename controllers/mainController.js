require(process.env.MODULE_PATH + '/dotenv').config();
const dbConnect = require(process.env.CONFIG_PATH + '/database');
const bcrypt = require(process.env.MODULE_PATH + '/bcrypt');
const express = require(process.env.MODULE_PATH + '/express');
const app = express();
const jwt = require(process.env.MODULE_PATH + '/jsonwebtoken');
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');
const bodyParser = require(process.env.MODULE_PATH + '/body-parser');
const { requireAdminAuth, requireCustomerAuth, secretKey } = require(process.env.CONFIG_PATH + '/auth');
const customersTable = process.env.TB_CUSTOMERS;
const adminsTable = process.env.TB_ADMINS;


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


exports.main_get = (req, res) => {
    res.render("pages/index");
};

exports.register = (req, res) => {
  res.render("pages/index");
};

exports.admin = (req, res) => {
  res.render("pages/index");
};

exports.customer = (req, res) => {
  res.render("pages/index");
};

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.redirect("/");
};


exports.login = (req, res) => {
  res.render("pages/index");
};


// Ortak İşlemler
exports.user_login = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
      // Admin kullanıcıları kontrol etme
      const admin = await dbConnect.query(`SELECT * FROM ${adminsTable} WHERE admin_Mail = ?`, [email]);
      const adminData = admin[0];
      if (adminData && adminData.length > 0) {
          const passwordMatch = await bcrypt.compare(String(password), String(adminData[0].admin_Password));
          if (passwordMatch) {
              const token = jwt.sign({ userId: adminData[0].admin_ID, email: adminData[0].admin_Mail, role: 'admin' }, secretKey, { expiresIn: '1h' });
              res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
              return res.status(200).json({ success: true, message: "Admin girişi başarıyla yapıldı.", token: token });
          } else {
              return res.status(401).json({ success: false, message: "Admin girişi başarısız." });
              
          }
      }

      // Customer kullanıcıları kontrol etme
      const customer = await dbConnect.query(`SELECT * FROM ${customersTable} WHERE customer_Mail = ?`, [email]);
      const customerData = customer[0];
      if (customerData && customerData.length > 0) {
          const passwordMatch = await bcrypt.compare(password, customerData[0].customer_Password);
          if (passwordMatch) {
              const token = jwt.sign({ userId: customerData[0].customer_ID, email: customerData[0].customer_Mail, role: 'customer' }, secretKey, { expiresIn: '1h' });
              res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
              return res.status(200).json({ success: true, message: "Müşteri girişi başarıyla yapıldı.", token: token });
          } else {
              return res.status(401).json({ success: false, message: "Geçersiz email veya şifre." });
          }
      }

      // Kullanıcı bulunamadıysa
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

