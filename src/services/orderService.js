import db from '../models/index';

const handleGetAllOrderNew = (action) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (action && action === 'new') {
                let res = await db.Order.findAll({
                    where: { status: 'new' },
                    order: [['id', 'DESC']],
                });
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
            if (action && action === 'process') {
                let res = await db.Order.findAll({
                    where: { status: 'process' },
                    order: [['id', 'DESC']],
                });
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
            if (action && action === 'shipping') {
                let res = await db.Order.findAll({
                    where: { status: 'shipping' },
                    order: [['id', 'DESC']],
                });
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};

const handleGetDetailOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = await db.Order.findOne({
                where: { id: id },
                include: [
                    {
                        model: db.ProductOrder,
                        attributes: ['id', 'quantity'],

                        include: [
                            {
                                model: db.Product,
                                attributes: ['id', 'title', 'price', 'discount'],

                                as: 'imageData',
                                include: [
                                    {
                                        model: db.Image,
                                        attributes: ['photo'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                raw: false,
                nest: true,
            });
            if (order) {
                let imageProducts = order.ProductOrders;
                imageProducts.forEach((item) => {
                    item.imageData.Images[0].photo = new Buffer(item.imageData.Images[0].photo, 'base64').toString(
                        'binary',
                    );
                });
                resolve({
                    errCode: 0,
                    data: order,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thông tin đơn hàng!!!',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};

const handleEditStatus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = await db.Order.findOne({
                where: { id: data.id },
            });
            if (order) {
                await db.Order.update(
                    {
                        status: data.selected,
                    },
                    {
                        where: { id: data.id },
                    },
                );

                resolve({
                    errCode: 0,
                    errMessage: `Cập nhật trạng thái thành công!`,
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};

const getAllOrderOfUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = await db.Order.findAll({
                where: { user_id: id },
                order: [['id', 'DESC']],

                attributes: ['order_number', 'sub_total', 'status'],
                include: [
                    {
                        model: db.ProductOrder,
                        attributes: ['quantity'],

                        include: [
                            {
                                model: db.Product,
                                attributes: ['id', 'title', 'price'],

                                as: 'imageData',
                                include: [
                                    {
                                        model: db.Image,
                                        attributes: ['photo'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                raw: false,
                nest: true,
            });
            if (order) {
                order.forEach((item) => {
                    if (item.ProductOrders) {
                        item.ProductOrders.forEach((jitem) => {
                            if (jitem.imageData) {
                                return (jitem.imageData.Images[0].photo = new Buffer(
                                    jitem.imageData.Images[0].photo,
                                    'base64',
                                ).toString('binary'));
                            }
                        });
                    }
                });
                resolve({
                    errCode: 0,
                    data: order,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thông tin đơn hàng!!!',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};

module.exports = {
    handleGetAllOrderNew,
    handleGetDetailOrder,
    handleEditStatus,
    getAllOrderOfUser,
};
