require(process.env.MODULE_PATH + '/dotenv').config();
const app = require(process.env.MODULE_PATH + "/express");
const router = app.Router();
const { requireAdminAuth, requireCustomerAuth } = require(process.env.CONFIG_PATH + '/auth');

// Controller Modülünü Çağırıyoruz
const product_controller = require("../controllers/productController");
const main_controller = require("../controllers/mainController");
const category_controller = require("../controllers/categoryController");
const adminuser_controller = require('../controllers/adminUserController');
const customeruser_controller = require('../controllers/customerUserController');

// ----------------------------------------------------------------------//

// ----- ANA KONTROL İŞLEMLERİ ----- //
router.get("/", main_controller.main_get);
router.get("/register", main_controller.register);
router.get("/login", main_controller.login);
router.post("/login", main_controller.user_login);
router.get("/logout", main_controller.logout);

// ----------------------------------------------------------------------//

// ----- ADMIN İŞLEMLERİ ----- //
router.get("/admin", requireAdminAuth, (req, res) => {
    main_controller.admin(req, res);
});
router.get("/admins", requireAdminAuth, (req, res) => {
    adminuser_controller.admin_list(req, res);
});
router.get("/admin/detail/:id", requireAdminAuth, (req, res) => {
    adminuser_controller.admin_detail(req, res);
});
router.post("/admin/create", requireAdminAuth, (req, res) => {
    adminuser_controller.admin_create(req, res);
});
router.put("/admin/edit/:id", requireAdminAuth, (req, res) => {
    adminuser_controller.admin_edit(req, res);
});
router.delete("/admin/delete/:id", requireAdminAuth, (req, res) => {
    adminuser_controller.admin_delete(req, res);
});

// ----------------------------------------------------------------------//

// ----- MÜŞTERİ İŞLEMLERİ ----- //
router.get("/customer", requireCustomerAuth, (req, res) => {
    main_controller.customer(req, res);
});
router.get("/customers", requireAdminAuth, (req, res) => {
    customeruser_controller.customer_list(req, res);
});
router.get("/customer/detail/:id", requireAdminAuth, (req, res) => {
    customeruser_controller.customer_detail(req, res);
});
router.post("/customer/create", requireAdminAuth, (req, res) => {
    customeruser_controller.customer_create(req, res);
});
router.put("/customer/edit/:id", requireAdminAuth, (req, res) => {
    customeruser_controller.customer_edit(req, res);
});
router.delete("/customer/delete/:id", requireAdminAuth, (req, res) => {
    customeruser_controller.customer_delete(req, res);
});

// ----------------------------------------------------------------------//

// ----- ÜRÜN İŞLEMLERİ ----- //
router.get("/products", requireAdminAuth, (req, res) => {
    product_controller.product_list(req, res);
});
router.get("/product/detail/:id", requireAdminAuth, (req, res) => {
    product_controller.product_detail(req, res);
});
router.post("/product/create", requireAdminAuth, (req, res) => {
    product_controller.product_create(req, res);
});
router.put("/product/edit/:id", requireAdminAuth, (req, res) => {
    product_controller.product_edit(req, res);
});
router.delete("/product/:id/delete", requireAdminAuth, (req, res) => {
    product_controller.product_delete(req, res);
});

// ----------------------------------------------------------------------//

// ----- KATEGORİ İŞLEMLERİ ----- //
router.get("/categories", requireAdminAuth, (req, res) => {
    category_controller.category_list(req, res);
});
router.get("/category/detail/:id", requireAdminAuth, (req, res) => {
    category_controller.category_detail(req, res);
});
router.put("/category/edit/:id", requireAdminAuth, (req, res) => {
    category_controller.category_edit(req, res);
});
router.post("/category/create", requireAdminAuth, (req, res) => {
    category_controller.category_create(req, res);
});
router.delete("/category/delete/:id", requireAdminAuth, (req, res) => {
    category_controller.category_delete(req, res);
});




// ----------------------------------------------------------------------//

module.exports = router;

