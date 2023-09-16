import moment from 'moment/moment';
import gift from '../models/gift';
import db from '../models/index';
const { Op } = require('sequelize');

//Brand
const createNewBrand = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!!',
                });
            } else {
                let res = await db.Brand.findOne({
                    where: { title: data.title },
                    raw: true,
                });
                if (res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'The brand already exists in the system',
                    });
                } else {
                    let brand = await db.Brand.create({
                        title: data.title,
                        status: data.status,
                    });

                    if (data.photo) {
                        await db.Image.create({
                            brand_id: brand.id,
                            photo: data.photo,
                        });
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Create brand successfully!!!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllBrands = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Brand.findAll({
                attributes: ['id', 'title', 'status'],

                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (res) {
                res.forEach((item) => {
                    if (item.Image) {
                        item.Image.photo = new Buffer(item.Image?.photo, 'base64').toString('binary');
                    }
                });
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const editBrand = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let brand = await db.Brand.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (brand) {
                await db.Brand.update(
                    {
                        title: data.title,
                        status: data.status,
                    },
                    {
                        where: { id: data.id },
                    },
                );

                await db.Image.update(
                    {
                        photo: data.photo,
                    },
                    {
                        where: { brand_id: data.id },
                    },
                );
                resolve({
                    errCode: 0,
                    errMessage: 'Update brand successfully!!!',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Brand not found!!!',
                });
            }
        } catch (e) {
            console.log('check', e);
            reject(e);
        }
    });
};

const handleDeleteBrand = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Brand.findOne({
                where: { id: id },
            });
            if (res) {
                await db.Product.update(
                    {
                        brand_id: null,
                    },
                    {
                        where: { brand_id: res.id },
                    },
                );
                await db.Brand.destroy({
                    where: { id: id },
                });
                await db.Image.destroy({
                    where: { brand_id: id },
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete brand successfully!!!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

//Category

const createNewCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!!',
                });
            } else {
                let res = await db.Category.findOne({
                    where: { title: data.title },
                });

                if (res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'The Category already exists in the system',
                    });
                } else {
                    let res = await db.Category.create({
                        title: data.title,
                        summary: data.summary,
                        photo: data.image,

                        is_parent: data.is_parent === '' ? 0 : data.is_parent,
                        parent_id: data.parent_id,
                        status: data.status,
                    });
                    await db.Image.create({
                        cat_id: res.id,
                        photo: data.image,
                    });

                    resolve({
                        errCode: 0,
                        errMessage: 'Create Category successfully!!!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllCategory = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Category.findAll({
                raw: false,
                limit: limit,
                attributes: ['id', 'title', 'is_parent', 'parent_id', 'status'],

                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
            });

            if (res) {
                res.forEach((item) => {
                    if (item.Image.photo) {
                        item.Image.photo = new Buffer(item.Image.photo, 'base64').toString('binary');
                    }
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
const getAllCategoryAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Category.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (res) {
                res.forEach((item) => {
                    if (item.Image.photo) {
                        item.Image.photo = new Buffer(item.Image.photo, 'base64').toString('binary');
                    }
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
const getAllParentCategory = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (limit) {
                let allCat = await db.Category.findAll({
                    limit: +limit,
                    where: { is_parent: 1 },
                    attributes: ['id', 'title'],

                    include: [
                        {
                            model: db.Image,
                            attributes: ['photo'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                allCat.forEach((item) => {
                    if (item.Image.photo) {
                        item.Image.photo = new Buffer(item.Image.photo, 'base64').toString('binary');
                    }
                });

                resolve({
                    errCode: 0,
                    data: allCat,
                });
            } else {
                let allCat = await db.Category.findAll({
                    where: { is_parent: 1 },
                    attributes: ['id', 'title'],

                    include: [
                        {
                            model: db.Image,
                            attributes: ['photo'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                allCat.forEach((item) => {
                    if (item.Image?.photo) {
                        item.Image.photo = new Buffer(item.Image?.photo, 'base64').toString('binary');
                    }
                });

                resolve({
                    errCode: 0,
                    data: allCat,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const editCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let Category = await db.Category.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (Category) {
                await db.Category.update(
                    {
                        title: data.title,
                        summary: data.summary,
                        is_parent: data.is_parent,
                        status: data.status,
                        parent_id: data.parent_id,
                    },
                    {
                        where: { id: Category.id },
                    },
                );
                await db.Image.update(
                    {
                        photo: data.image,
                    },
                    {
                        where: { cat_id: data.id },
                    },
                );

                resolve({
                    errCode: 0,
                    errMessage: 'Update Category successfully!!!',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Category not found!!!',
                });
            }
        } catch (e) {
            console.log('check', e);
            reject(e);
        }
    });
};

const handleDeleteCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Category.findOne({
                where: { id: id },
            });
            if (res) {
                await db.Product.update(
                    {
                        cat_id: null,
                    },
                    {
                        where: { cat_id: res.id },
                    },
                );
                await db.Category.destroy({
                    where: { id: id },
                });

                await db.Image.destroy({
                    where: { cat_id: id },
                });

                resolve({
                    errCode: 0,
                    errMessage: 'Delete Category successfully!!!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
// const checkRequiredFields = (data) => {
//     let arrFields = [
//         'title',
//         'summary',
//         'description',
//         'photo',
//         'price',
//         'catId',
//         'brandId',
//         'discount',
//         'stock',
//         'condition',
//         'status',
//     ];
//     let isValid = true;
//     let element;
//     for (let i = 0; i < arrFields.length; i++) {
//         if (!data[arrFields[i]]) {
//             isValid = false;
//             element = arrFields[i];
//         }
//     }

//     return {
//         isValid,
//         element,
//     };
// };
const saveDetailProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.title ||
                !data.unit_of_product ||
                !data.photo ||
                !data.stock ||
                !data.price ||
                !data.condition ||
                !data.status ||
                !data.brand_id ||
                !data.cat_id ||
                !data.action
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                });
            } else {
                let product = await db.Product.findOne({
                    where: { title: data.title },
                });
                if (data.action === 'CREATE') {
                    if (product) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Product already exists in the system!!!',
                        });
                    } else {
                        let res = await db.Product.create({
                            cat_id: data.cat_id,
                            brand_id: data.brand_id,
                            title: data.title,
                            photo: data.photo,
                            type: data.type,
                            stock: data.stock,
                            unit_of_product: data.unit_of_product,
                            expiry: data.expiry,
                            price: data.price,
                            discount: data.discount,
                            condition: data.condition,
                            status: data.status,
                        });

                        await db.Markdown.create({
                            product_id: res.id,
                            descriptionHtml: data.descriptionHtml,
                            descriptionMarkdown: data.descriptionMarkdown,
                            specificationHtml: data.specificationHtml,
                            specificationMarkdown: data.specificationMarkdown,
                            featureHtml: data.featureHtml,
                            featureMarkdown: data.featureMarkdown,
                            assignHtml: data.assignHtml,
                            assignMarkdown: data.assignMarkdown,
                        });

                        let arrPhoto = [];

                        data.photo.map((item) => {
                            let obj = {};

                            obj.product_id = res.id;
                            obj.photo = item;

                            return arrPhoto.push(obj);
                        });

                        await db.Image.bulkCreate(arrPhoto);

                        resolve({
                            errCode: 0,
                            errMessage: 'Create product successfully',
                        });
                    }
                } else if (data.action === 'EDIT') {
                    await db.Product.update(
                        {
                            cat_id: data.cat_id,
                            brand_id: data.brand_id,
                            title: data.title,
                            photo: data.photo,
                            type: data.type,
                            stock: data.stock,
                            unit_of_product: data.unit_of_product,
                            expiry: data.expiry,
                            price: data.price,
                            discount: data.discount,
                            condition: data.condition,
                            status: data.status,
                        },
                        {
                            where: { id: data.id },
                        },
                    );

                    await db.Markdown.update(
                        {
                            descriptionHtml: data.descriptionHtml,
                            descriptionMarkdown: data.descriptionMarkdown,
                            specificationHtml: data.specificationHtml,
                            specificationMarkdown: data.specificationMarkdown,
                            featureHtml: data.featureHtml,
                            featureMarkdown: data.featureMarkdown,
                            assignHtml: data.assignHtml,
                            assignMarkdown: data.assignMarkdown,
                        },
                        {
                            where: { product_id: data.id },
                        },
                    );
                    await db.Image.destroy({
                        where: { product_id: data.id },
                    });
                    let arrPhoto = [];
                    data.photo.map((item) => {
                        let obj = {};

                        obj.product_id = data.id;
                        obj.photo = item;

                        return arrPhoto.push(obj);
                    });

                    await db.Image.bulkCreate(arrPhoto);

                    resolve({
                        errCode: 0,
                        errMessage: 'Edit product successfully',
                    });
                }
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const handleDeleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Product.findOne({
                where: { id: id },
            });

            if (res) {
                await db.Markdown.destroy({
                    where: { product_id: id },
                });
                await db.Product.destroy({
                    where: { id: id },
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete product successfully!!!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Product.findAll({
                raw: false,
                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
            });

            if (res) {
                if (res.Images) {
                    res.forEach((item) => {
                        item.Images.map((item) => {
                            return (item.photo = new Buffer(item.photo, 'base64').toString('binary'));
                        });
                    });
                }
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const getProductByCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //filter brand and hasn't category
            if (data.brand_id && !data.id) {
                //filter with range price
                if (data.priceA) {
                    if (data.action === 'trend') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,
                                condition: 'hot',
                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],

                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'sold') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        sold: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'discount') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        discount: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceLow') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.lt]: 120000,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceHigh') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.gt]: 2000000,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    }
                } else {
                    //filter hasn't range price
                    if (data.action === 'trend') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,
                                condition: 'hot',
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'sold') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        sold: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'discount') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        discount: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceLow') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.lt]: 120000,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceHigh') {
                        let res = await db.Product.findAll({
                            where: {
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.gt]: 2000000,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    }
                }
            } else if (data.id && !data.brand_id) {
                //filter category and hasn't brand
                //filter range price
                if (data.priceA) {
                    if (data.action === 'trend') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                condition: 'hot',
                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'sold') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        sold: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'discount') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        discount: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceLow') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.lt]: 120000,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceHigh') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.gt]: 2000000,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    }
                } else {
                    //filter hasn't range price
                    if (data.action === 'trend') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                condition: 'hot',
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'sold') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        sold: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'discount') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        discount: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceLow') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.lt]: 120000,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceHigh') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.gt]: 2000000,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    }
                }
            } else if (data.brand_id && data.id) {
                if (data.priceA) {
                    if (data.action === 'trend') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,
                                condition: 'hot',
                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'sold') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        sold: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'discount') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        discount: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceLow') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.lt]: 120000,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceHigh') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.gt]: 2000000,
                                        },
                                    },
                                    {
                                        price: {
                                            [Op.between]: [data.priceA, data.priceB],
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    }
                } else {
                    //filter hasn't range price
                    if (data.action === 'trend') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,
                                condition: 'hot',
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'sold') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        sold: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'discount') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        discount: {
                                            [Op.gt]: 30,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceLow') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.lt]: 120000,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    } else if (data.action === 'priceHigh') {
                        let res = await db.Product.findAll({
                            where: {
                                cat_id: data.id,
                                brand_id: data.brand_id,

                                [Op.and]: [
                                    {
                                        price: {
                                            [Op.gt]: 2000000,
                                        },
                                    },
                                ],
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'status'],
                            },
                            include: [
                                {
                                    model: db.Image,
                                    attributes: ['photo'],
                                },
                                {
                                    model: db.Brand,
                                    attributes: ['title'],
                                },
                                {
                                    model: db.Review,
                                    attributes: ['rate'],
                                },
                            ],
                            raw: false,
                            nest: true,
                        });
                        if (res.length > 0) {
                            res.forEach((item) => {
                                return (item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString(
                                    'binary',
                                ));
                            });
                            resolve({
                                errCode: 0,
                                data: res,
                            });
                        } else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Không có sản phẩm cho lựa chọn này!',
                            });
                        }
                    }
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Bạn vui lòng chọn loại danh mục hoặc nhãn hàng để xem các sản phẩm !!!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const getAllProductHome = () => {
    return new Promise(async (resolve, reject) => {
        const dateLogin = moment(new Date()).format('DD/MM/YYYY');
        const timeLogin = moment(new Date()).format('HH:mm');
        await db.HistoryLogin.create({
            time: `Xem trang chủ ngày: ${dateLogin}, giờ: ${timeLogin}`,
        });
        try {
            let res = await db.Product.findAll({
                attributes: ['id', 'title', 'price', 'sold', 'discount', 'unit_of_product'],
                include: [
                    {
                        model: db.Brand,
                        attributes: ['title'],
                    },
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                    {
                        model: db.Review,
                        attributes: ['rate'],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (res) {
                let arr = [];
                res.map((item) => {
                    let productData = {};
                    let imageR = new Buffer(item.Images[0].photo, 'base64').toString('binary');
                    productData.brand = item.Brand?.title;
                    productData.image = imageR;
                    productData.discount = item.discount;
                    productData.reviews = item.Reviews;
                    productData.id = item.id;
                    productData.price = item.price;
                    productData.sold = item.sold;
                    productData.title = item.title;
                    productData.unit = item.unit_of_product;

                    arr.push(productData);

                    resolve({
                        errCode: 0,
                        data: arr,
                    });
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const getProductInfoAdminById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Product.findOne({
                where: { id: id },
                // attributes: ['title', ''],
                include: [
                    {
                        model: db.Markdown,
                    },
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (!res) {
                resolve({
                    errCode: 1,
                    errMessage: 'Product not exist:!!!',
                });
            } else {
                if (res.Images) {
                    res.Images.forEach((item) => {
                        item.photo = new Buffer(item.photo, 'base64').toString('binary');
                    });
                }
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const getProductInfoById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Product.findOne({
                where: { id: id },

                include: [
                    {
                        model: db.Brand,
                        attributes: ['title'],
                    },
                    {
                        model: db.Category,
                        attributes: ['title'],
                    },
                    {
                        model: db.Review,
                        attributes: ['id', 'rate', 'title', 'description', 'status'],
                        include: [
                            {
                                model: db.User,
                                attributes: ['firstName'],
                                include: [
                                    {
                                        model: db.Image,
                                        attributes: ['photo'],
                                    },
                                ],
                            },
                        ],
                    },

                    {
                        model: db.Markdown,
                        attributes: ['descriptionHtml', 'specificationHtml', 'featureHtml', 'assignHtml'],
                    },
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            });

            if (res.Reviews && res.Reviews.length > 0) {
                res.Reviews.map((item) => {
                    if (item.User && item.User.Image.photo) {
                        item.User.Image.photo = new Buffer(item.User.Image.photo, 'base64').toString('binary');
                    }
                });
            }

            let dataProduct = {};
            dataProduct.dataProduct = res;
            // dataProduct.InfoUserReview = user;

            if (!res) {
                resolve({
                    errCode: 1,
                    errMessage: 'Product not exist:!!!',
                });
            } else {
                if (res.Images) {
                    res.Images.forEach((item) => {
                        item.photo = new Buffer(item.photo, 'base64').toString('binary');
                    });
                }

                resolve({
                    errCode: 0,
                    data: dataProduct,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const handleReviewProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Review.create({
                user_id: data.user_id,
                product_id: data.product_id,
                rate: data.rate,
                title: data.title,
                description: data.description,
                status: true,
            });

            await db.User.update(
                {
                    review_id: data.product_id,
                },
                {
                    where: { id: data.user_id },
                },
            );

            resolve({
                errCode: 0,
                errMessage: 'Cảm ơn bạn đã đánh giá! ',
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const handleSearchProduct = (q) => {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: '%' + q + '%' } },
                        // { '$Product.body$': { [Op.like]: '%' + query + '%' } },
                    ],
                },
                attributes: ['id', 'title'],
                include: [
                    {
                        model: db.Image,
                        attributes: ['photo'],
                    },
                ],
                raw: false,
                nest: true,
            };

            let res = await db.Product.findAll(options);

            if (res) {
                res.map((item) => {
                    item.Images[0].photo = new Buffer(item.Images[0].photo, 'base64').toString('binary');
                });

                let dataSearch = [];

                res.forEach((item) => {
                    let obj = {};
                    obj.id = item.id;
                    obj.title = item.title;
                    obj.photo = item.Images[0].photo;

                    dataSearch.push(obj);
                });

                resolve({
                    errCode: 0,
                    data: dataSearch,
                });
            } else {
                console.log('lõi');
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const handleAddProductToCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Cart.findOne({
                where: { product_id: data.product_id },
            });

            let quantityProduct = await db.Product.findOne({
                where: { id: data.product_id },
            });

            if (data.quantity > quantityProduct.stock) {
                resolve({
                    errCode: 1,
                    errMessage: `Chỉ còn lại ${quantityProduct.stock} sản phẩm trong cửa hàng!!!`,
                });
            } else {
                if (!res) {
                    await db.Cart.create({
                        product_id: data.product_id,
                        user_id: data.user_id,
                        quantity: data.quantity,
                    });
                    resolve({
                        errCode: 0,
                        errMessage: 'Add product successfully',
                    });
                } else {
                    if (data.quantity === 0) {
                        await db.Cart.destroy({
                            where: { product_id: data.product_id, user_id: data.user_id },
                        });
                    }
                    await db.Cart.update(
                        {
                            quantity: data.quantity,
                        },
                        {
                            where: { product_id: data.product_id, user_id: data.user_id },
                        },
                    );
                    resolve({
                        errCode: 0,
                        errMessage: 'Update quantity product successfully',
                    });
                }
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const handleAddCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await db.Coupon.findOne({
                where: { code: data.code },
            });
            if (res) {
                resolve({
                    errCode: 1,
                    errMessage: 'coupon is exitsaaa',
                });
            } else {
                await db.Coupon.create({
                    code: data.code,
                    value: data.value,
                    status: data.status,
                    stock: data.stock,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Add coupon successfully!!!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

const getAllCoupon = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await db.Coupon.findAll();
            if (res && res.length > 0) {
                resolve({
                    errCode: 0,
                    data: res,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Đã có lỗi gì đó, vui lòng thử lại sau!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const handleDeleteCoupon = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await db.Coupon.destroy({
                where: { id: id },
            });
            if (res) {
                resolve({
                    errCode: 0,
                    errMessage: 'Xóa mã giảm giá thành công!',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Đã có lỗi gì đó, vui lòng thử lại sau!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const handleUpdateCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = db.Coupon.findOne({
                where: { code: data.code },
            });
            if (!res) {
                resolve({
                    errCode: 1,
                    errMessage: 'coupon is not exits',
                });
            } else {
                await db.Coupon.update(
                    {
                        code: data.code,
                        value: data.value,
                        status: data.status,
                        stock: data.stock,
                    },
                    {
                        where: { id: data.id },
                    },
                );
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhật thành công!!!',
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const handleSearchCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await db.Coupon.findOne({
                where: { code: data },
            });
            if (!res) {
                resolve({
                    errCode: 1,
                    errMessage: 'coupon is not exits',
                });
            } else {
                resolve({
                    errCode: 0,
                    data: res,
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};
const handleCreateOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.action === 'new') {
                let user = await db.User.findOne({
                    where: { id: data.user_id },
                });
                if (user) {
                    await db.User.update(
                        {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            address: data.address,
                            phonenumber: data.phonenumber,
                        },
                        {
                            where: { id: data.user_id },
                        },
                    );
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy người dùng!!!',
                    });
                }
            }

            let res = await db.Order.create({
                user_id: data.user_id,
                order_number: data.order_number,
                product_id: 0,
                coupon: data.coupon,
                sub_total: data.sub_total,
                quantity: data.quantity,
                lastName: data.lastName,
                firstName: data.firstName,
                address: data.address,
                phonenumber: data.phonenumber,
                note: data.note ? data.note : '',
                email: data.email,
                status: data.status,
            });

            let arr = [];

            data.product.map((item) => {
                let obj = {};
                obj.product_id = item.product_id;
                obj.quantity = item.quantity;
                obj.order_id = res.id;
                return arr.push(obj);
            });
            await db.ProductOrder.bulkCreate(arr);
            arr.forEach(async (item) => {
                let prod = await db.Product.findOne({
                    where: { id: item.product_id },
                });
                if (prod) {
                    await db.Product.update(
                        {
                            sold: prod.sold ? prod.sold + item.quantity : item.quantity,
                            stock: prod.stock - item.quantity,
                        },
                        {
                            where: { id: item.product_id },
                        },
                    );
                }
            });
            let coup = await db.Coupon.findOne({
                where: { code: data.coupon },
            });
            if (coup) {
                await db.Coupon.update(
                    {
                        stock: coup.stock - 1,
                    },
                    {
                        where: { id: coup.id },
                    },
                );
            }

            await db.Cart.destroy({
                where: { user_id: data.user_id },
            });
            resolve({
                errCode: 0,
                errMessage: 'Đặt hàng thành công !!!',
            });
        } catch (e) {
            console.log('check loi service', e);
            reject(e);
        }
    });
};
const handleGetAllOrderNew = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Order.findAll({
                where: { status: 'new' },
            });
            resolve({
                errCode: 0,
                data: res,
            });
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleTurnover = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const TODAY_START = new Date(data).setUTCHours(0, 0, 0, 0);

            const NOW = new Date(data).setUTCHours(23, 59, 59, 999);
            const products = await db.Order.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: TODAY_START,
                        [Op.lte]: NOW,
                    },
                },
                attributes: ['order_number', 'sub_total'],
            });
            resolve({
                errCode: 0,
                data: products,
            });
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};

const handleTurnoverWeek = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await db.Order.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().subtract(1, 'w'),
                        // [Op.lte]: NOW,
                    },
                },
                order: [['createdAt', 'DESC']],

                attributes: ['order_number', 'sub_total', 'createdAt'],
            });

            resolve({
                errCode: 0,
                data: products,
            });
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};

const handleTurnoverMonth = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const TODAY_START = moment('2022-11-01').format('YYYY-MM-DD 00:00');
            const NOW = moment('2022-11-30').format('YYYY-MM-DD 23:59');

            const products = await db.Order.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: TODAY_START,
                        [Op.lte]: NOW,
                    },
                },
            });

            resolve({
                errCode: 0,
                data: products,
            });
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleAddGift = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Đã có lỗi xảy ra vui lòng thử lại sau!',
                });
            } else {
                await db.Gift.create({
                    title: data.title,
                    status: data.status,
                });
                resolve({
                    errCode: 0,
                    errMessgae: 'Thêm quà tặng thành công!',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleGetAllGift = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const gifts = await db.Gift.findAll({
                order: [['createdAt', 'DESC']],
            });
            if (gifts) {
                resolve({
                    errCode: 0,
                    data: gifts,
                });
            } else {
                resolve({
                    errCode: 1,
                    data: [],
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleGetAllGiftActive = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const gifts = await db.Gift.findAll({
                order: [['createdAt', 'DESC']],
                where: { status: 1 },
            });
            if (gifts) {
                resolve({
                    errCode: 0,
                    data: gifts,
                });
            } else {
                resolve({
                    errCode: 1,
                    data: [],
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleEditGift = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Gift.findOne({
                where: { id: data.id },
                raw: false,
                nest: true,
            });
            if (res) {
                res.title = data.title;
                res.status = +data.status;
                await res.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhật quà tặng thành công!',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy quà tặng đang chỉnh sửa trong hệ thống!',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleGetDetailGift = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gift = await db.Gift.findOne({
                where: { id: id },
            });
            if (gift) {
                resolve({
                    errCode: 0,
                    data: gift,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy quà tặng đang chỉnh sửa trong hệ thống!',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleDeleteGift = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gift = await db.Gift.destroy({
                where: { id: id },
            });
            if (gift) {
                resolve({
                    errCode: 0,
                    errMessage: 'Xóa quà tặng thành công!',
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy quà tặng đang chỉnh sửa trong hệ thống!',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const getProductOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await db.ProductOrder.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().subtract(1, 'w'),
                        // [Op.lte]: NOW,
                    },
                },
                include: [
                    {
                        model: db.Product,
                        attributes: ['title'],

                        as: 'imageData',
                    },
                ],
                order: [['createdAt', 'DESC']],
                raw: false,
                nest: true,
            });

            resolve({
                errCode: 0,
                data: products,
            });
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
module.exports = {
    createNewBrand,
    getAllBrands,
    editBrand,
    handleDeleteBrand,
    createNewCategory,
    getAllCategory,
    getAllCategoryAdmin,
    editCategory,
    handleDeleteCategory,
    getAllParentCategory,
    saveDetailProduct,
    handleDeleteProduct,
    getAllProduct,
    getProductInfoAdminById,
    getProductInfoById,
    handleSearchProduct,
    getAllProductHome,
    handleReviewProduct,
    handleAddProductToCart,
    handleAddCoupon,
    getAllCoupon,
    handleDeleteCoupon,
    handleUpdateCoupon,
    handleSearchCoupon,
    handleCreateOrder,
    handleGetAllOrderNew,
    getProductByCategory,
    handleTurnover,
    handleTurnoverMonth,
    handleTurnoverWeek,
    handleAddGift,
    handleGetAllGift,
    handleGetAllGiftActive,
    handleEditGift,
    handleGetDetailGift,
    handleDeleteGift,
    getProductOrder,
};
