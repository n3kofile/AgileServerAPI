const express = require('express');
const router = express.Router();
const userModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationRegister } = require('../../middle/Validation');
const { validationChangePassword } = require('../../middle/Validation');

router.post('/login', async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        // Tìm kiếm người dùng trong cơ sở dữ liệu
        const user = await userModel.findOne({ userName });

        if (user) {
            // So sánh mật khẩu được cung cấp với mật khẩu đã được hash trong cơ sở dữ liệu
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                // Tạo mã thông báo (token) sử dụng JWT
                const token = jwt.sign({ userId: user._id }, 'agile', { expiresIn: '5h' });

                return res.status(200).json({ result: true, token });
            } else {
                return res.status(401).json({ result: false, message: 'Invalid password' });
            }
        } else {
            return res.status(404).json({ result: false, message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ result: false, message: 'Internal server error' });
    }
});

router.post('/register', [validationRegister], async (req, res, next) => {
    try {
        const { fullName, userName, password, email, phoneNumber } = req.body;

        // Kiểm tra xem tên người dùng hoặc email đã tồn tại trong cơ sở dữ liệu hay chưa
        const existingUser = await userModel.findOne().or([{ userName }, { email }]);
        if (existingUser) {
            return res.status(409).json({ result: false, message: 'Username or email already exists' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new userModel({ fullName, userName, password: hashedPassword, email, phoneNumber });
        await newUser.save();

        return res.status(201).json({ result: true, message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ result: false, message: 'Internal server error' });
    }
});

router.post('/change-password', [validationChangePassword], async (req, res, next) => {
    try {
        const { userName, currentPassword, newPassword } = req.body;

        // Tìm kiếm người dùng trong cơ sở dữ liệu
        const user = await userModel.findOne({ userName });

        // So sánh mật khẩu hiện tại được cung cấp với mật khẩu đã được hash trong cơ sở dữ liệu
        const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password);

        if (isCurrentPasswordMatch) {
            // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Cập nhật mật khẩu mới cho người dùng
            user.password = hashedNewPassword;
            await user.save();

            return res.status(200).json({ result: true, message: 'Password changed successfully' });
        } else {
            return res.status(401).json({ result: false, message: 'Incorrect current password' });
        }
    } catch (error) {
        return res.status(500).json({ result: false, message: 'Internal server error' });
    }
});

module.exports = router;
