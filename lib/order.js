"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatus = exports.handleOrder = void 0;
const axios_1 = require("axios");
function getSignature(orderData, appSecret) {
    let str = '';
    // const secret = md5(appSecret);
    for (let key in orderData) {
        if (key !== 'sign' && key !== 'opreturn') {
            if (str) {
                str += '&' + key + '=' + orderData[key];
            }
            else {
                str = key + '=' + orderData[key];
            }
        }
    }
    // str += '&secret=' + secret;
    str = str.toUpperCase();
    // const sign = crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex');
    // return sign;
}
exports.handleOrder = (CLIENT_ID, SECRET) => {
    return (orderData, log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (orderData.app_id !== CLIENT_ID)
                throw 'order app_id does not match server app_id';
            if (log)
                console.log('==============orderData==============\n', orderData);
            const signedOrder = Object.assign(Object.assign({}, orderData), { sign: getSignature(orderData, SECRET) });
            if (log)
                console.log('==============posting signed order==============\n', signedOrder);
            const orderSnResponse = yield axios_1.default.post('https://www.ddpurse.com/platform/openapi/create_order', signedOrder);
            const orderSnData = orderSnResponse.data;
            if (orderSnData.data && orderSnData.data.order_sn && orderSnData.code === 0) {
                if (log)
                    console.log('==============orderSnData==============', orderSnData);
                return orderSnData.data.order_sn;
            }
            else
                throw orderSnResponse;
        }
        catch (err) {
            if (log)
                console.log('==============err==============\n', err);
            return err;
        }
    });
};
exports.getOrderStatus = (CLIENT_ID, SECRET, log) => {
    return (merchant_order_sn) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orderStatusResponse = yield axios_1.default.post('https://www.ddpurse.com/platform/openapi/search_order', {
                app_id: CLIENT_ID,
                secret: SECRET,
                merchant_order_sn: merchant_order_sn,
            });
            if (!orderStatusResponse.data)
                throw orderStatusResponse;
            const orderStatusData = orderStatusResponse.data;
            if (log)
                console.log('==============orderStatus==============\n', orderStatusData);
            if (!orderStatusData.data || orderStatusData.code !== 0)
                throw orderStatusData;
            const returnData = orderStatusData.data;
            return returnData;
        }
        catch (err) {
            if (log)
                console.log('==============err==============\n', err);
            return err;
        }
    });
};
