const jwt = require(process.env.MODULE_PATH + '/jsonwebtoken');
const cookieParser = require(process.env.MODULE_PATH + '/cookie-parser');

const secretKey = 'your_secret_key'; // JWT'nin imzalaması için kullanılacak gizli anahtar

// CookieParser middleware'ini kullanma
const useCookieParser = cookieParser();

// JWT ile oturum doğrulamasını gerçekleştiren middleware fonksiyonu
const requireAuth = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.jwt;

    // Token kontrolü
    if (token) {
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.error(err);
                res.redirect('/login');
            } else {
                console.log(decodedToken);

                if (allowedRoles.includes(decodedToken.role)) {
                    next();
                } else {
                    res.status(403).json({ message: "Bu sayfaya erişim izniniz yok." });
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

const setAuthToken = (req, res, next) => {
    const userId = 'user_id';
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

    next();
};

const requireAdminAuth = requireAuth(['admin']);

const requireCustomerAuth = requireAuth(['customer']);

module.exports = { requireAdminAuth, requireCustomerAuth, setAuthToken, useCookieParser, secretKey };
