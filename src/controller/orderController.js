import orderService from '../services/orderService';
import productService from '../services/productService';

const handleGetAllOrderNew = async (req, res) => {
    try {
        let response = await orderService.handleGetAllOrderNew(req.query.action);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleGetDetailOrder = async (req, res) => {
    try {
        let response = await orderService.handleGetDetailOrder(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleEditStatus = async (req, res) => {
    try {
        let response = await orderService.handleEditStatus(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getAllOrderOfUser = async (req, res) => {
    try {
        let response = await orderService.getAllOrderOfUser(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

module.exports = {
    handleGetAllOrderNew,
    handleGetDetailOrder,
    handleEditStatus,
    getAllOrderOfUser,
};
