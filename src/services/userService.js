import db from '../models/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment/moment';

let handleRegisterUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            ///Hash password
            const salt = await bcrypt.genSalt(10);
            const hased = await bcrypt.hash(data.password, salt);

            let checkMail = await checkUserEmail(data.email);

            if (checkMail === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email already exists',
                });
            } else {
                let res = await db.User.create({
                    email: data.email,
                    password: hased,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    positionId: data.positionId,
                    gender: data.gender,
                    roleId: data.roleId,
                });

                await db.Image.create({
                    user_id: res.id,
                    photo: data?.avatar,
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Create user successfully!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleRegisterCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            ///Hash password
            if (!data.email || !data.password || !data.firstName || !data.lastName) {
                const salt = await bcrypt.genSalt(10);
                const hased = await bcrypt.hash(data.password, salt);

                let checkMail = await checkUserEmail(data.email);

                if (checkMail === true) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email already exists',
                    });
                } else {
                    let res = await db.User.create({
                        email: data.email,
                        password: hased,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        roleId: 'customer',

                        address: data.address,
                        phonenumber: data.phonenumber,
                        positionId: 'customer',
                        gender: data.gender,
                    });

                    await db.Image.create({
                        user_id: res.id,
                        photo: data.avatar,
                    });

                    resolve({
                        errCode: 0,
                        errMessage: 'Create user successfully!',
                    });
                }
            } else {
                reject({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

//GENERATE ACCESS TOKEN
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            roleId: user.roleId,
        },
        process.env.JWT_ACCESS_KEY,
        {
            expiresIn: '1d',
        },
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            roleId: user.roleId,
        },
        process.env.JWT_REFRESH_KEY,
        {
            expiresIn: '365d',
        },
    );
};

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExits = await checkUserEmail(email);
            if (isExits) {
                //user is already exits
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: [
                        'id',
                        'firstName',
                        'lastName',
                        'email',
                        'address',
                        'password',
                        'roleId',
                        'rememberToken',
                    ],
                    include: [
                        {
                            model: db.Image,
                            attributes: ['photo'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        const dateLogin = moment(new Date()).format('DD/MM/YYYY');
                        const timeLogin = moment(new Date()).format('HH:mm');
                        await db.HistoryLogin.create({
                            time: `Đăng nhập ngày: ${dateLogin}, giờ: ${timeLogin}`,
                        });

                        const accessToken = generateAccessToken(user);
                        const refreshToken = generateRefreshToken(user);

                        await db.User.update(
                            {
                                rememberToken: refreshToken,
                            },
                            {
                                where: { id: user.id },
                            },
                        );

                        if (user.Image.photo) {
                            user.Image.photo = new Buffer(user.Image.photo, 'base64').toString('binary');
                        }

                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                        userData.accessToken = accessToken;
                        userData.refreshToken = refreshToken;
                        delete user.rememberToken;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    (userData.errCode = 2), (userData.errMessage = 'User is not found! ');
                }
            } else {
                //return error
                (userData.errCode = 1),
                    (userData.errMessage = "Your's Email isn't exits in your system. Plz try other email! ");
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};
let handleCustomerLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExits = await checkUserEmail(data.email);
            if (isExits) {
                //user is already exits
                let user = await db.User.findOne({
                    where: { email: data.email },

                    include: [
                        {
                            model: db.Image,
                            attributes: ['photo'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (user) {
                    let check = await bcrypt.compareSync(data.password, user.password);
                    if (check) {
                        if (user.Image.photo) {
                            user.Image.photo = new Buffer(user.Image.photo, 'base64').toString('binary');
                        }

                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    (userData.errCode = 2), (userData.errMessage = 'User is not found! ');
                }
            } else {
                //return error
                (userData.errCode = 1),
                    (userData.errMessage = "Your's Email isn't exits in your system. Plz try other email! ");
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};
let handleRefreshToken = (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { rememberToken: refreshToken },
                raw: false,
                nest: true,
            });
            if (!user) {
                resolve({
                    errCode: -1,
                    errMessage: 'Refresh token is not valid',
                });
            }
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, userToken) => {
                if (err) {
                    console.log(err);
                }
                const newAccessToken = generateAccessToken(userToken);
                const newFreshToken = generateRefreshToken(userToken);

                await db.User.update(
                    {
                        rememberToken: newFreshToken,
                    },
                    {
                        where: { id: user.id },
                    },
                );

                resolve({
                    accessToken: newAccessToken,
                    refreshToken: newFreshToken,
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};
let checkUserEmail = (emailUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: emailUser },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleGetAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findAll({
                where: {},
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            });

            user.forEach((item) => {
                if (item?.Image?.photo) {
                    item.Image.photo = new Buffer(item.Image.photo, 'base64').toString('binary');
                }
            });

            if (user) {
                resolve({
                    errCode: 0,
                    data: user,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Cannot find user',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleEditUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.firstName || !data.lastName || !data.roleId || !data.gender || !data.phonenumber) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter!',
                });
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: true,
            });

            if (user) {
                let res = await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phonenumber: data.phonenumber,
                        address: data.address,
                        roleId: data.roleId,
                        positionId: data.positionId,
                        image: data.avatar,
                        gender: data.gender,
                    },
                    {
                        where: { id: user.id },
                    },
                );

                await db.Image.update(
                    {
                        photo: data.avatar,
                    },
                    {
                        where: { user_id: user.id },
                    },
                );

                resolve({
                    errCode: 0,
                    errMessage: 'Update user successfully',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleDeleteUser = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: inputId },
            });
            if (user) {
                await db.User.destroy({
                    where: { id: inputId },
                });

                await db.Image.destroy({
                    where: { user_id: inputId },
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Deleted user!',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Cannot find user on system',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleLogout = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.update(
                {
                    rememberToken: null,
                },
                {
                    where: { id: id },
                },
            );

            resolve({
                errCode: 0,
                errMessage: 'Logged out!!',
            });
        } catch (e) {
            reject(e);
        }
    });
};

let handleGetUserInfoById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (user.Image.photo) {
                user.Image.photo = new Buffer(user.Image.photo, 'base64').toString('binary');
            }

            if (user) {
                resolve({
                    errCode: 0,
                    data: user,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters ',
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin,
    checkUserEmail,
    handleRegisterUser,
    handleGetAllUsers,
    handleDeleteUser,
    generateAccessToken,
    generateRefreshToken,
    handleRefreshToken,
    handleLogout,
    handleGetUserInfoById,
    handleEditUser,
    handleRegisterCustomer,
    handleCustomerLogin,
    getAllCodeService,
};
