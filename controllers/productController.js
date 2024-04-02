require(process.env.MODULE_PATH + '/dotenv').config();
const dbConnect = require(process.env.CONFIG_PATH + '/database');
const Product = require('../models/productModel');
const express = require(process.env.MODULE_PATH + '/express');
const app = express();
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');
const bodyParser = require(process.env.MODULE_PATH + '/body-parser');

const productsTable = process.env.TB_PRODUCTS;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


exports.product_list = async (req, res) => {
    let responseProducts = [];

    [products] =  await dbConnect.query(`SELECT * FROM ${productsTable}`);
    if(products.length>0){
      await products.forEach(async (product) => {
          const resProduct = new Product(product["product_ID"],product["product_Name"],product["product_Desc"],product["product_Category"],product["product_Price"],product["product_IMG"],product["product_Status"]);
          responseProducts.push(resProduct);
        });
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify({succes:true, message: responseProducts})) 
        
    }
    else {
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify({success:false,message:{desc:"Hiç sonuç bulunmadı."}}))
      }
};


exports.product_detail = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await dbConnect.query(`SELECT * FROM ${productsTable} WHERE product_ID = ?`, [productId]);
        const productData = product[0][0];

        if (!productData) {
            res.status(404).json({ success: false, message: "Ürün bulunamadı." });
            return;
        }

        res.set('Content-Type', 'application/json');
        res.json({ success: true, message: productData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.product_create = async (req, res) => {
    const { name, desc, category, price, image } = req.body;
    try {
        await dbConnect.query(`INSERT INTO ${productsTable} (product_Name, product_Desc, product_Category, product_Price, product_IMG) VALUES (?, ?, ?, ?, ?)`, [name, desc, category, price, image]);

        res.set('Content-Type', 'application/json');
        res.json({ success: true, message: "Ürün başarıyla eklendi." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.product_delete = async (req, res) => {
    const productId = req.params.id;
    try {
        await dbConnect.query(`DELETE FROM ${productsTable} WHERE product_ID = ?`, [productId]);

        res.set('Content-Type', 'application/json');
        res.json({ success: true, message: "Ürün başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// ID'ye göre Müşteri Düzenleme
exports.product_edit = async (req, res) => {
    const productId = req.params.id;
    const { productName, productDesc, categoryID, price, image } = req.body;

    try {
        const updateParams = [];
        let updateQuery = `UPDATE ${productsTable} SET`;

        if (productName!== undefined) {
            updateQuery += ` product_Name = ?,`;
            updateParams.push(productName);
        }
        if (productDesc !== undefined) {
            updateQuery += ` product_Desc = ?,`;
            updateParams.push(productDesc);
        }
        if (categoryID !== undefined) {
            updateQuery += ` product_Category = ?,`;
            updateParams.push(categoryID);
        }
        if (price !== undefined) {
            updateQuery += ` product_Price = ?,`;
            updateParams.push(price);
        }
        if (image !== undefined) {
            updateQuery += ` product_IMG = ?,`;
            updateParams.push(image);
        }

        updateQuery = updateQuery.slice(0, -1);
        updateQuery += ` WHERE product_ID = ?`;
        updateParams.push(productId);
        await dbConnect.query(updateQuery, updateParams);

        res.set('Content-Type', 'application/json')
        res.json({ success: true, message: "Ürün başarıyla güncellendi." });
    } catch (error) {
        res.set('Content-Type', 'application/json')
        res.status(500).send(JSON.stringify({ success: false, error: error.message }));
    }
};