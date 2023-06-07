const userModel = require('../routes/models/UserModel');

// bắt lỗi validate trước khi xử lý bên APIUser
const validationRegister = async (req, res, next) => {
    const { userName, password, fullName, email, phoneNumber } = req.body;
    if (!email || !password || !fullName || !userName || !phoneNumber) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập đầy đủ thông tin' })
    } else {
        let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(email)) {
            return res.status(400).json({ result: false, message: 'Email không hợp lệ' })
        }
        regex = /^(?=.*\d)[0-9a-zA-Z]{8,}$/;

        if (!regex.test(password)) {
            return res.status(400).json({ result: false, message: 'Mật khẩu tối thiêu 8 ký tự và bao gồm chữ và số' })
        }
        return next(); // Cần để skip qua validate khi không có trường hợp nào vi phạm validate
    }
}

const validationChangePassword = async (req, res, next) => {
    const { userName, currentPassword, newPassword } = req.body;

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await userModel.findOne({ userName });
    if (!user) {
        return res.status(404).json({ result: false, message: 'User not found' });
    }

    regex = /^(?=.*\d)[0-9a-zA-Z]{8,}$/;
    if (!userName || !currentPassword || !newPassword) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập đầy đủ thông tin' })
    }
    if (!regex.test(newPassword)) {
        return res.status(400).json({ result: false, message: 'Mật khẩu tối thiêu 8 ký tự và bao gồm chữ và số' })
    }
    return next(); // Cần để skip qua validate khi không có trường hợp nào vi phạm validate
}

module.exports = { validationRegister, validationChangePassword }