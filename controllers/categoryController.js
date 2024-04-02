require(process.env.MODULE_PATH + '/dotenv').config();
const dbConnect = require(process.env.CONFIG_PATH + '/database');
const Category = require('../models/categoryModel');
const express = require(process.env.MODULE_PATH + '/express');
const app = express();
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');
const bodyParser = require(process.env.MODULE_PATH + '/body-parser');
const categoriesTable = process.env.TB_CATEGORIES;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

exports.category_list = async (req, res) => {
    let responseCategories = [];

    [categories] =  await dbConnect.query(`SELECT * FROM ${categoriesTable}`);
    if(categories.length>0){
      await categories.forEach(async (category) => {
          const resCategory = new Category(category["category_ID"],category["category_Name"],category["category_IMG"]);
          responseCategories.push(resCategory);
        });
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify({succes:true, message: responseCategories})) 
        
    }
    else {
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify({success:false,message:{desc:"Hiç sonuç bulunmadı."}}))
      }
};

exports.category_detail = async (req, res) => {
  const categoryId = req.params.id;
  try {
      const category = await dbConnect.query(`SELECT category_ID, category_Name, category_IMG FROM ${categoriesTable} WHERE category_ID = ?`, [categoryId]);
      const categoryData = category[0][0];

      if (!categoryData) {
          res.status(404).json({ success: false, message: "Kategori bulunamadı." });
          return;
      }

      res.set('Content-Type', 'application/json')
      res.json({ success: true, message: categoryData });
  } catch (error) {
      res.set('Content-Type', 'application/json')
      res.status(500).send(JSON.stringify({ error: error.message }));
  }
};
  
exports.category_create = async (req, res) => {
  const name = req.body.name;
  try {
      if (!name) {
          res.status(400).json({ success: false, message: "Kategori adı gereklidir." });
          return;
      }
      await dbConnect.query(`INSERT INTO ${categoriesTable} (category_Name) VALUES (?)`, [name]);

      res.set('Content-Type', 'application/json');
      res.json({ success: true, message: "Kategori başarıyla eklendi." });
  } catch (error) {
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({ success: false, error: error.message }));
  }
};
  
exports.category_delete = async (req, res) => {
  const categoryId = req.params.id;
  try {
    await dbConnect.query(`DELETE FROM ${categoriesTable} WHERE category_ID = ?`, [categoryId]);

    // Send success response
    res.set('Content-Type', 'application/json');
    res.json({ success: true, message: "Kategori başarıyla silindi." });
  } catch (error) {
    // Handle errors
    res.set('Content-Type', 'application/json');
    res.status(500).send(JSON.stringify({ success: false, error: error.message }));
  }
};

// ID'ye göre Kategori Düzenleme
exports.category_edit = async (req, res) => {
  const categoryId = req.params.id;
  const { name, img } = req.body;

  try {
      const updateParams = [];
      let updateQuery =`UPDATE ${categoriesTable} SET`;

      if (name !== undefined) {
          updateQuery += ` category_Name = ?,`;
          updateParams.push(name);
      }
      if (img !== undefined) {
          updateQuery += ` category_IMG = ?,`;
          updateParams.push(img);
      }

      updateQuery = updateQuery.slice(0, -1);
      updateQuery += ` WHERE category_ID = ?`;
      updateParams.push(categoryId);

      await dbConnect.query(updateQuery, updateParams);

      res.set('Content-Type', 'application/json')
      res.json({ success: true, message: "Kategori başarıyla güncellendi." });
  } catch (error) {
      res.set('Content-Type', 'application/json')
      res.status(500).send(JSON.stringify({ success: false, error: error.message }));
  }
};

  