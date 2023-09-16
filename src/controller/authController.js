import userService from '../services/userService';

const registerUser = async (req, res) => {
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

const handleLogin = async (req, res) => {
    try {
        let response = await userService.handleUserLogin(req.body.email, req.body.password);

        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
        });

        return res.status(200).json({
            errCode: response.errCode,
            errMessage: response.errMessage,
            user: response.user,
            accessToken: response.accessToken,
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleRefreshToken = async (req, res) => {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticate");

    let verifyRefreshToken = await userService.handleRefreshToken(refreshToken);

    res.cookie('refreshToken', verifyRefreshToken.refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
    });
    return res.status(200).json({ accessToken: verifyRefreshToken.accessToken });
    // return res.status(200).json(refreshToken);
};

const handleLogout = async (req, res) => {
    await res.clearCookie('refreshToken');
    let response = await userService.handleLogout(req.query.id);

    return res.status(200).json(response);
};

const handleCustomerLogin = async (req, res) => {
    try {
        let response = await userService.handleCustomerLogin(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log('check', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

module.exports = {
    registerUser,
    handleLogin,
    handleRefreshToken,
    handleLogout,
    handleCustomerLogin,
};
