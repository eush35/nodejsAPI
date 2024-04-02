require('dotenv').config();
const express = require(process.env.MODULE_PATH + '/express');
const app = express();
const path = require(process.env.MODULE_PATH + '/path');
const bodyParser = require(process.env.MODULE_PATH + '/body-parser');
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');
const pool = require(process.env.CONFIG_PATH + '/database');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Sunucu başlatıldı: ${PORT}`);
});

const appRouter = require(process.env.ROUTE_PATH + "/routes");
 app.use("/", appRouter);
