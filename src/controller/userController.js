import { query } from 'express';
import userService from '../services/userService';

const registerCustomer = async (req, res) => {
    try {
        let response = await userService.handleRegisterUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameters',
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

//API

const handleGetAllUsers = async (req, res) => {
    try {
        let response = await userService.handleGetAllUsers();
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleDeleteUser = async (req, res) => {
    try {
        let response = await userService.handleDeleteUser(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleEditUser = async (req, res) => {
    try {
        let response = await userService.handleEditUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleGetUserInfoById = async (req, res) => {
    try {
        let response = await userService.handleGetUserInfoById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleDeleteUser,
    handleGetUserInfoById,
    handleEditUser,
    registerCustomer,
    getAllCode,
};
