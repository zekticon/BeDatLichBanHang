const db = require('../models');

const handleCreateNewBanner = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let banner = await db.Banner.create({
                title: 'banner',
                summary: 'Banner summary',
                status: true,
            });
            await db.Image.create({
                banner_id: banner.id,
                photo: null,
            });

            resolve({
                errCode: 0,
                errMessage: 'Tạo banner thành công!',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const handleUpdateBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: 'Hình như có lỗi gì đó, vui lòng thử lại sau!',
                });
            } else {
                await db.Image.update(
                    {
                        photo: data.photo,
                    },
                    {
                        where: { banner_id: data.id },
                    },
                );

                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhật banner thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
const handleGetAllBanner = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await db.Banner.findAll({
                attributes: ['id'],

                include: [
                    {
                        model: db.Image,
                        attributes: ['id', 'photo'],
                    },
                ],
                order: [['id']],
                raw: false,
                nest: true,
            });
            if (res) {
                res.forEach((item) => {
                    if (item.Image.photo !== null) {
                        item.Image.photo = new Buffer(item.Image.photo, 'base64').toString('binary');
                    }
                    return item;
                });
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleUpdateBanner,
    handleCreateNewBanner,
    handleGetAllBanner,
};
