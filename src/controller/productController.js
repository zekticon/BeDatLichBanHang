import productService from '../services/productService';

//Controller Brand
const createNewBrand = async (req, res) => {
    try {
        let response = await productService.createNewBrand(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const getAllBrands = async (req, res) => {
    try {
        let response = await productService.getAllBrands();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const editBrand = async (req, res) => {
    try {
        let response = await productService.editBrand(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleDeleteBrand = async (req, res) => {
    try {
        let response = await productService.handleDeleteBrand(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

//Controller Category
const createNewCategory = async (req, res) => {
    try {
        let response = await productService.createNewCategory(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const getAllParentCategory = async (req, res) => {
    try {
        let limit = req.query.limit;

        let response = await productService.getAllParentCategory(limit);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const getAllCategory = async (req, res) => {
    try {
        let limit = req.query.limit;
        let response = await productService.getAllCategory(+limit);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getAllCategoryAdmin = async (req, res) => {
    try {
        let response = await productService.getAllCategoryAdmin();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const editCategory = async (req, res) => {
    try {
        let response = await productService.editCategory(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleDeleteCategory = async (req, res) => {
    try {
        let response = await productService.handleDeleteCategory(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const saveDetailProduct = async (req, res) => {
    try {
        let response = await productService.saveDetailProduct(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleDeleteProduct = async (req, res) => {
    try {
        let response = await productService.handleDeleteProduct(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const getAllProduct = async (req, res) => {
    try {
        let response = await productService.getAllProduct();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getProductByCategory = async (req, res) => {
    try {
        let data = {
            id: +req.query?.id,
            brand_id: req.query?.brand_id,
            priceA: req.query?.priceA,
            priceB: req.query?.priceB,
            action: req.query?.action,
        };
        let response = await productService.getProductByCategory(data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getProductInfoAdminById = async (req, res) => {
    try {
        let response = await productService.getProductInfoAdminById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getProductInfoById = async (req, res) => {
    try {
        let response = await productService.getProductInfoById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleSearchProduct = async (req, res) => {
    try {
        let response = await productService.handleSearchProduct(req.query.q);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getAllProductHome = async (req, res) => {
    try {
        let response = await productService.getAllProductHome();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleReviewProduct = async (req, res) => {
    try {
        let response = await productService.handleReviewProduct(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleAddProductToCart = async (req, res) => {
    if (req.body) {
        try {
            let response = await productService.handleAddProductToCart(req.body);
            return res.status(200).json(response);
        } catch (e) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server...',
            });
        }
    }
};

const handleAddCoupon = async (req, res) => {
    if (req.body) {
        try {
            let response = await productService.handleAddCoupon(req.body);
            return res.status(200).json(response);
        } catch (e) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server...',
            });
        }
    }
};
const handleDeleteCoupon = async (req, res) => {
    if (req.body) {
        try {
            let response = await productService.handleDeleteCoupon(req.query.id);
            return res.status(200).json(response);
        } catch (e) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server...',
            });
        }
    }
};
const getAllCoupon = async (req, res) => {
    try {
        let response = await productService.getAllCoupon();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleUpdateCoupon = async (req, res) => {
    if (req.body) {
        try {
            let response = await productService.handleUpdateCoupon(req.body);
            return res.status(200).json(response);
        } catch (e) {
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server...',
            });
        }
    }
};
const handleSearchCoupon = async (req, res) => {
    try {
        let response = await productService.handleSearchCoupon(req.query.q);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const handleCreateOrder = async (req, res) => {
    try {
        let response = await productService.handleCreateOrder(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

const getTurnover = async (req, res) => {
    try {
        let response = await productService.handleTurnover(req.query.date);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleTurnoverMonth = async (req, res) => {
    try {
        let response = await productService.handleTurnoverMonth();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleTurnoverWeek = async (req, res) => {
    try {
        let response = await productService.handleTurnoverWeek();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleAddGift = async (req, res) => {
    try {
        let response = await productService.handleAddGift(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleGetAllGift = async (req, res) => {
    try {
        let response = await productService.handleGetAllGift();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleGetAllGiftActive = async (req, res) => {
    try {
        let response = await productService.handleGetAllGiftActive();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleEditGift = async (req, res) => {
    try {
        let response = await productService.handleEditGift(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleGetDetailGift = async (req, res) => {
    try {
        let response = await productService.handleGetDetailGift(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleDeleteGift = async (req, res) => {
    try {
        let response = await productService.handleDeleteGift(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const getProductOrder = async (req, res) => {
    try {
        let response = await productService.getProductOrder();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
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
    handleReviewProduct,
    handleSearchProduct,
    getAllProductHome,
    handleAddProductToCart,
    handleAddCoupon,
    getAllCoupon,
    handleUpdateCoupon,
    handleDeleteCoupon,
    handleSearchCoupon,
    handleCreateOrder,
    getProductByCategory,
    getTurnover,
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
