require(process.env.MODULE_PATH + '/dotenv').config();
const dbConnect = require(process.env.CONFIG_PATH + '/database');
const CustomerUser = require('../models/customerUserModel');
const bcrypt = require(process.env.MODULE_PATH + '/bcrypt');
const express = require(process.env.MODULE_PATH + '/express');
const app = express();
const jwt = require(process.env.MODULE_PATH + '/jsonwebtoken');
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');
const bodyParser = require(process.env.MODULE_PATH + '/body-parser');
const customersTable = process.env.TB_CUSTOMERS;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// Müşterileri Listele
exports.customer_list = async (req, res) => {
    try {
        const customers = await dbConnect.query(`SELECT customer_ID, customer_Name, customer_Surname, customer_Mail, customer_Phone, customer_Password, customer_Address, customer_Product, customer_Role, customer_Status FROM ${customersTable}`);
        const customersData = customers[0];
        res.set('Content-Type', 'application/json')
        res.json({ success: true, customers: customersData });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
};

// Müşteri Detayı
exports.customer_detail = async (req, res) => {
    const customerId = req.params.id;
    try {
        const customer = await dbConnect.query(`SELECT customer_ID, customer_Name, customer_Surname, customer_Mail, customer_Phone, customer_Address, customer_Product, customer_Role, customer_Status FROM ${customersTable} WHERE customer_ID = ?`, [customerId]);
        const customerData = customer[0][0];

        if (!customerData) {
            res.status(404).json({ success: false, message: "Müşteri bulunamadı." });
            return;
        }

        res.set('Content-Type', 'application/json')
        res.json({ success: true, customer: customerData });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
};

// Müşteri Oluşturma
exports.customer_create = async (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let mail = req.body.mail;
    let phone = req.body.phone;
    let password = req.body.password;
    let address = req.body.address;
    let product = req.body.product;
    let role = req.body.role;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomerUser = new CustomerUser(null, name, surname, mail, phone, hashedPassword, address, product, role,);
        await dbConnect.query(`INSERT INTO ${customersTable} (customer_Name, customer_Surname, customer_Mail, customer_Phone, customer_Password, customer_Address, customer_Product, customer_Role) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)`, [newCustomerUser.customer_Name, newCustomerUser.customer_Surname, newCustomerUser.customer_Mail, newCustomerUser.customer_Phone, newCustomerUser.customer_Password, newCustomerUser.customer_Address, newCustomerUser.customer_Role]);
        res.set('Content-Type', 'application/json')
        res.json({ success: true, message: "Müşteri başarıyla eklendi." });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
};

// ID'ye göre Müşteri Silme
exports.customer_delete = async (req, res) => {
    const customerId = req.params.id;
    try {
        await dbConnect.query(`DELETE FROM ${customersTable} WHERE customer_ID = ?`, [customerId]);
        res.set('Content-Type', 'application/json')
        res.json({ success: true, message: "Müşteri başarıyla silindi." });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
};

// ID'ye göre Müşteri Düzenleme
exports.customer_edit = async (req, res) => {
    const customerId = req.params.id;
    const { name, surname, mail, phone, password, address, product, role } = req.body;

    try {
        const updateParams = [];
        let updateQuery = `UPDATE ${customersTable} SET`;

        if (name !== undefined) {
            updateQuery += ` customer_Name = ?,`;
            updateParams.push(name);
        }
        if (surname !== undefined) {
            updateQuery += ` customer_Surname = ?,`;
            updateParams.push(surname);
        }
        if (mail !== undefined) {
            updateQuery += ` customer_Mail = ?,`;
            updateParams.push(mail);
        }
        if (phone !== undefined) {
            updateQuery += ` customer_Phone = ?,`;
            updateParams.push(phone);
        }
        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += ` customer_Password = ?,`;
            updateParams.push(hashedPassword);
        }
        if (address !== undefined) {
            updateQuery += ` customer_Address = ?,`;
            updateParams.push(address);
        }
        if (product !== undefined) {
            updateQuery += ` customer_Product = ?,`;
            updateParams.push(product);
        }
        if (role !== undefined) {
            updateQuery += ` customer_Role = ?,`;
            updateParams.push(role);
        }

        updateQuery = updateQuery.slice(0, -1);
        updateQuery += ` WHERE customer_ID = ?`;
        updateParams.push(customerId);
        await dbConnect.query(updateQuery, updateParams);

        res.set('Content-Type', 'application/json')
        res.json({ success: true, message: "Müşteri başarıyla güncellendi." });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ success: false, error: error.message }));
    }
};




