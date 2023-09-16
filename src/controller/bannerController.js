import bannerService from '../services/bannerService';

const handleUpdateBanner = async (req, res) => {
    try {
        let response = await bannerService.handleUpdateBanner(req.body);

        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleCreateNewBanner = async (req, res) => {
    try {
        let response = await bannerService.handleCreateNewBanner(req.body);

        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};
const handleGetAllBanner = async (req, res) => {
    try {
        let response = await bannerService.handleGetAllBanner();

        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...',
        });
    }
};

module.exports = {
    handleUpdateBanner,
    handleCreateNewBanner,
    handleGetAllBanner,
};
