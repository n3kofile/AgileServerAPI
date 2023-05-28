// bắt lỗi validate trước khi xử lý bên APIUser
const validationRegister = async (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập đầy đủ thông tin' })
    } else {
        let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(email)) {
            return res.status(400).json({ result: false, message: 'Email không hợp lệ' })
        }
        regex = /^\d{4}$/;

        if (!regex.test(password)) {
            return res.status(400).json({ result: false, message: 'Mật khẩu phải 4 số' })
        }
        return next();
    }
}

module.exports = { validationRegister }