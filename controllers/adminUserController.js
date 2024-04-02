require(process.env.MODULE_PATH + '/dotenv').config();
const dbConnect = require(process.env.CONFIG_PATH + '/database');
const AdminUser = require('../models/adminUserModel');
const bcrypt = require(process.env.MODULE_PATH + '/bcrypt');
const express = require(process.env.MODULE_PATH + '/express');
const app = express();
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');
const bodyParser = require(process.env.MODULE_PATH + '/body-parser');
const adminsTable = process.env.TB_ADMINS;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Adminleri Listele

exports.admin_list = async (req, res) => {
    try {
        let responseAdmins = [];

        const [admins] = await dbConnect.query(`SELECT admin_ID, admin_Name, admin_Surname, admin_Mail, admin_Phone, admin_Password, admin_Address, admin_Role FROM ${adminsTable}`);

        if (admins.length > 0) {
            await admins.forEach(async (admin) => {
                const resAdmin = new AdminUser(admin["admin_ID"], admin["admin_Name"], admin["admin_Surname"], admin["admin_Mail"], admin["admin_Phone"], admin["admin_Password"], admin["admin_Address"], admin["admin_Role"]);
                responseAdmins.push(resAdmin);
            });
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ success: true, admins: responseAdmins }));
        } else {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ success: false, data: { desc: "Hiç sonuç bulunmadı." } }));
        }
    } catch (error) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
};


// Admin Detayı
exports.admin_detail = async (req, res) => {
    const adminId = req.params.id;
    try {
        const admin = await dbConnect.query(`SELECT admin_ID, admin_Name, admin_Surname, admin_Mail, admin_Phone, admin_Address, admin_Role FROM ${adminsTable} WHERE admin_ID = ?`, [adminId]);
        const adminData = admin[0][0];

        if (!adminData) {
            res.status(404).json({ success: false, message: "Admin bulunamadı." });
            return;
        }

        res.set('Content-Type', 'application/json')
        res.json({ success: true, admin: adminData });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
};

// Admin Oluştur
exports.admin_create = async (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let mail = req.body.mail;
    let phone = req.body.phone;
    let password = req.body.password;
    let address = req.body.address;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdminUser = new AdminUser(null, name, surname, mail, phone, hashedPassword, address);

        await dbConnect.query(`INSERT INTO ${adminsTable} (admin_Name, admin_Surname, admin_Mail, admin_Phone, admin_Password, admin_Address) VALUES (?, ?, ?, ?, ?, ?)`, [newAdminUser.admin_Name, newAdminUser.admin_Surname, newAdminUser.admin_Mail, newAdminUser.admin_Phone, newAdminUser.admin_Password, newAdminUser.admin_Address]);
        res.set('Content-Type', 'application/json')
        res.json({ success: true, message: "Admin başarıyla eklendi." });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ error: error.message }));
    }

};

// ID'ye göre Admin Düzenleme
exports.admin_edit = async (req, res) => {
    const adminId = req.params.id;
    const { name, surname, mail, phone, password, address, role } = req.body;

    try {
        const updateParams = [];
        let updateQuery = `UPDATE ${adminsTable} SET`;

        if (name !== undefined) {
            updateQuery += ` admin_Name = ?,`;
            updateParams.push(name);
        }
        if (surname !== undefined) {
            updateQuery += ` admin_Surname = ?,`;
            updateParams.push(surname);
        }
        if (mail !== undefined) {
            updateQuery += ` admin_Mail = ?,"`;
            updateParams.push(mail);
        }
        if (phone !== undefined) {
            updateQuery += ` admin_Phone = ?,`;
            updateParams.push(phone);
        }
        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += ` admin_Password = ?,`;
            updateParams.push(hashedPassword);
        }
        if (address !== undefined) {
            updateQuery += ` admin_Address = ?,`;
            updateParams.push(address);
        }
        if (role !== undefined) {
            updateQuery += ` admin_Role = ?,`;
            updateParams.push(role);
        }
        updateQuery = updateQuery.slice(0, -1);
        updateQuery += ` WHERE admin_ID = ?`;
        updateParams.push(adminId);

        await dbConnect.query(updateQuery, updateParams);

        res.set('Content-Type', 'application/json')
        res.json({ success: true, message: "Admin başarıyla güncellendi." });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ success: false, error: error.message }));
    }
};

// ID'ye göre Admin Silme
exports.admin_delete = async (req, res) => {
    const adminId = req.params.id;
    try {
        const [admin] = await dbConnect.query(`SELECT * FROM ${adminsTable} WHERE admin_ID = ?`, [adminId]);
        
        if (admin.length > 0) {
            await dbConnect.query(`DELETE FROM ${adminsTable} WHERE admin_ID = ?`, [adminId]);
            res.set('Content-Type', 'application/json');
            res.json({ success: true, message: "Admin başarıyla silindi." });
        } else {
            res.status(404).json({ success: false, message: "ID'ye ait admin bulunamadı." });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


