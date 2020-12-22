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
exports.hostedAccountBalance = exports.getHostedAccount = exports.saveData = void 0;
const axios_1 = require("axios");
exports.saveData = (CLIENT_ID, SECRET) => {
    return (data, dataType = 0, log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const saveDataOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    appid: CLIENT_ID,
                    appsecret: SECRET,
                },
                method: 'POST',
                data: {
                    coin_type: 'BSV',
                    data: dataType === 0 ? JSON.stringify(data) : data,
                    data_type: dataType,
                },
            };
            const res = yield axios_1.default('https://www.ddpurse.com/platform/openapi/v2/push_chain_data', saveDataOptions);
            const saveDataResponse = res.data;
            if (log)
                console.log('==============saveDataResponse==============', saveDataResponse);
            if (saveDataResponse.code !== 0)
                throw saveDataResponse;
            const returnData = saveDataResponse.data;
            return returnData;
        }
        catch (err) {
            if (log)
                console.log('==============err==============\n', err);
            return err;
        }
    });
};
exports.getHostedAccount = (CLIENT_ID, SECRET) => {
    return (coinType = 'BSV', log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const getHostedOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    appid: CLIENT_ID,
                    appsecret: SECRET,
                },
                method: 'POST',
                data: {
                    coin_type: coinType,
                },
            };
            const res = yield axios_1.default('https://www.ddpurse.com/platform/openapi/v2/get_hosted_account', getHostedOptions);
            const getHostedData = res.data;
            if (log)
                console.log('==============getHostedData==============', getHostedData);
            if (getHostedData.code !== 0 || !getHostedData.data.address)
                throw getHostedData;
            const returnData = getHostedData.data;
            return returnData;
        }
        catch (err) {
            if (log)
                console.log('==============err==============\n', err);
            return err;
        }
    });
};
exports.hostedAccountBalance = (CLIENT_ID, SECRET) => {
    return (coinType = 'BSV', log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const getBalanceOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    appid: CLIENT_ID,
                    appsecret: SECRET,
                },
                method: 'POST',
                data: {
                    coin_type: coinType,
                },
            };
            const getBalance = yield axios_1.default('https://www.ddpurse.com/platform/openapi/v2/get_hosted_account_balance', getBalanceOptions);
            const getBalanceData = getBalance.data;
            if (log)
                console.log('==============getBalanceData==============', getBalanceData);
            if (getBalanceData.code !== 0 || !getBalanceData.data)
                throw getBalanceData;
            const returnData = getBalanceData.data;
            return returnData;
        }
        catch (err) {
            if (log)
                console.log('==============err==============\n', err);
            return err;
        }
    });
};
