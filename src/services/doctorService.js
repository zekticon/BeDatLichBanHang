const db = require('../models');
require('dotenv').config();
import _ from 'lodash';
import moment from 'moment';
const { Op } = require('sequelize');

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'Doctor' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Image,

                        attributes: ['photo'],
                    },
                ],

                raw: true,
                nest: true,
            });
            if (users) {
                users.forEach((item) => {
                    if (item.Image.photo) {
                        return (item.Image.photo = new Buffer(item.Image.photo, 'base64').toString('binary'));
                    }
                });
            }
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'Doctor' },
                attributes: {
                    exclude: ['password'],
                },
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let checkRequiredFields = (inputData) => {
    let arrField = [
        'doctorId',
        'contentHTML',
        'action',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        'nameClinic',
        'addressClinic',
        'note',
    ];
    let isValid = true;
    let element = '';

    for (let i = 0; i < arrField.length; i++) {
        if (!inputData[arrField[i]]) {
            isValid = false;
            element = arrField[i];
            break;
        }
    }
    return {
        isValid,
        element,
    };
};

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: -1,
                    errMessage: 'Bác sĩ ơi bạn đã quên nhập gì đó !!!',
                });
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        specificationHtml: inputData.contentHTML,
                        descriptionHtml: inputData.description,
                        user_id: inputData.doctorId,
                    });
                }
                if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { user_id: inputData.doctorId },
                        raw: false,
                    });

                    if (doctorMarkdown) {
                        doctorMarkdown.specificationHtml = inputData.contentHTML;
                        doctorMarkdown.descriptionHtml = inputData.description;
                        await doctorMarkdown.save();
                    }
                }

                let doctorInfo = await db.Doctor_info.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                });
                if (doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.note = inputData.note;
                    await doctorInfo.save();
                } else {
                    await db.Doctor_info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Tạo thông tin bác sĩ thành công.',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Đã không tìm thấy id của bác sĩ!',
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['descriptionHtml', 'specificationHtml'],
                        },
                        {
                            model: db.Image,
                            attributes: ['photo'],
                        },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    attributes: {
                        exclude: ['password'],
                    },
                    raw: false,
                    nest: true,
                });

                if (data.Image && data.Image.photo) {
                    data.Image.photo = new Buffer(data.Image.photo, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required schedule',
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: +date,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getExtraInfoDoctorBy = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required schedule',
                });
            } else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'priceTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'provinceTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'paymentTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required schedule',
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['descriptionHtml', 'specificationHtml'],
                        },

                        {
                            model: db.Image,
                            attributes: ['photo'],
                        },

                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    attributes: {
                        exclude: ['password'],
                    },
                    raw: false,
                    nest: true,
                });

                if (data && data.Image) {
                    data.Image.photo = new Buffer(data.Image.photo, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
const getScheduleDoctorById = (id, date, action) => {
    let whereS2 = {
        doctorId: id,
        statusId: 'S2',
        date: date,
    };
    let whereS3 = {
        doctorId: id,
        statusId: 'S3',
    };
    return new Promise(async (resolve, reject) => {
        const dataBooking = await db.Booking.findAll({
            where: action === 'history' ? whereS3 : whereS2,
            include: [
                {
                    model: db.User,
                    attributes: ['address', 'email', 'phonenumber', 'lastName'],
                },
                {
                    model: db.Allcode,
                    as: 'time',
                    attributes: ['valueVi'],
                },
            ],
            attributes: {
                exclude: ['token', 'createdAt', 'updatedAt'],
            },

            raw: false,
            nest: true,
        });

        if (!dataBooking) dataBooking = [];

        resolve({
            errCode: 0,
            data: dataBooking,
        });
        try {
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const editBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        if (!data.id) {
            resolve({
                errCode: 1,
                errMessage: 'Đã xảy ra sai sót gì đó vui lòng thử lại !!!',
            });
        } else {
            let res = await db.Booking.update({ statusId: data.status }, { where: { id: data.id } });
            if (res[0] !== 1) {
                resolve({
                    errCode: 2,
                    errMessage: 'Không tìm thấy đơn khám trên hệ thống, vui lòng thử lại!',
                });
            } else {
                resolve({
                    errCode: 0,
                    errMessage: 'Đã cập nhật trạng thái thành công!',
                });
            }
        }
        try {
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
const handleCreateAllcodes = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: 'fail',
                });
            } else {
                await db.Allcode.create({
                    key: data.key,
                    type: data.type,
                    valueEn: data.valueEn,
                    valueVi: data.valueVi,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'create success',
                });
            }
        } catch (e) {
            console.log('check ', e);
            reject(e);
        }
    });
};
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInfoDoctorBy: getExtraInfoDoctorBy,
    getProfileDoctorById: getProfileDoctorById,
    getScheduleDoctorById: getScheduleDoctorById,
    editBookAppointment: editBookAppointment,
    handleCreateAllcodes: handleCreateAllcodes,
};
