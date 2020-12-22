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
exports.autopayment = void 0;
const axios_1 = require("axios");
exports.autopayment = (SECRET) => {
    return (orderData, log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let returnData;
            // could add check here if recieve address is dev's own
            if (log)
                console.log('==============orderData==============\n', orderData);
            const orderWithSecret = Object.assign(Object.assign({}, orderData), { secret: SECRET });
            if (log)
                console.log('==============posting order==============\n', orderWithSecret);
            const orderResponse = yield axios_1.default.post('https://www.ddpurse.com/openapi/pay_small_money', orderWithSecret);
            const orderResponseData = orderResponse.data;
            if (log)
                console.log('==============orderResponseData==============', orderResponseData);
            if (
            // balance or limit too low
            orderResponseData.code === -101001 ||
                orderResponseData.code === -10039 ||
                orderResponseData.code === -10044) {
                returnData = { error: orderResponseData.msg || orderResponseData.data || orderResponseData };
                return returnData;
            }
            else if (orderResponseData.code !== 0)
                throw orderResponse;
            if (orderResponseData.data) {
                returnData = orderResponseData.data;
                return returnData;
            }
            else {
                throw orderResponseData;
            }
        }
        catch (err) {
            if (log)
                console.log('==============err==============\n', err);
            return err;
        }
    });
};
