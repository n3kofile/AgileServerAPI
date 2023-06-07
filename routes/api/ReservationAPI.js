const express = require('express');
const router = express.Router();
const reservationModel = require('../models/ReservationModel')

router.post('/create', async (req, res, next) => {
    try {
        const { reservationId, tablePosition, fullName, email, phoneNumber, menuItemsSelected } = req.body;

        // Tạo phiếu đặt bàn mới mới
        const newReservation = new userModel({ reservationId, tablePosition, fullName, email, phoneNumber, menuItemsSelected });
        await newReservation.save();
    } catch (error) {

    }
});

router.delete('delete-reservation/:reservationId', async (req, res, next) => {
    const { reservationId } = req.params;

    try {
        // Kiểm tra xem reservation có tồn tại không
        const existingReservation = await reservationModel.findById(reservationId);
        if (!existingReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Xóa reservation
        await reservationModel.findByIdAndDelete(reservationId);

        // Trả về phản hồi thành công
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT: Sửa đổi thành phần của đối tượng dựa trên reservationId
router.put('edit-reservation/:reservationId', async (req, res, next) => {
    const { reservationId } = req.params;
    const { tablePosition, fullName, email, phoneNumber, menuItemsSelected } = req.body;

    try {
        const reservationModel = await reservationModel.findOne({ reservationId });

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Cập nhật các thuộc tính của đối tượng dựa trên yêu cầu
        reservationModel.tablePosition = tablePosition;
        reservationModel.fullName = fullName;
        reservationModel.email = email;
        reservationModel.phoneNumber = phoneNumber;
        reservationModel.menuItemsSelected = menuItemsSelected;

        // Lưu lại đối tượng đã sửa đổi
        await reservationModel.save();

        return res.json({ message: 'Reservation updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;