const jwt = require('jsonwebtoken');

//kiểm tra token của web cpanel
const checkTokenCpanel = (req, res, next) => {
    const { session } = req; //lấy session
    const url = req.originalUrl.toLowerCase(); //lấy url 
    //url = http://localhost:3000/cpanel/product/new
    //nếu không có thì chuyển sang trang login 
    if (!session) {
        //muốn login? -> cho đi login
        //muốn # -> cho đi login
        if (url.includes('/login')) {
            return next();
        } else {
            return res.redirect('/login');
        }
    } else {
        const { token } = session;
        if (!token) {
            if (url.includes('/login')) {
                return next();
            } else {
                return res.redirect('/login');
            }
        } else {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) {
                    if (url.includes('/login')) {
                        return next();
                    } else {
                        return res.redirect('/login');
                    }
                } else {
                    if (url.includes('/login')) {
                        //chuyển qua trang chủ
                        return res.redirect('/');
                    } else {
                        //kiểm tra role
                        const { role } = decoded;
                        console.log(role)
                        if (role < 100) {
                            req.session.destroy();
                            return res.redirect('/Login')
                        }
                        return next();
                    }
                }
            })
        }
    }
}

const checkTokenApp = (req, res, next) => {
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] == 'Bearer')
        token = req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, 'secret', function (error, decoded) {
            if (error) {
                return res.status(401).json({ status: false })
            } else {
                return next();
            }
        })
    } else {
        return res.status(401).json({ status: false })
    }

}

module.exports = { checkTokenCpanel, checkTokenApp }