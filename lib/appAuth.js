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
exports.getAppAccessToken = void 0;
const axios_1 = require("axios");
exports.getAppAccessToken = (CLIENT_ID, SECRET, DotWalletClass, log) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            client_id: CLIENT_ID,
            client_secret: SECRET,
            grant_type: 'client_credentials',
        };
        const accessTokenRequest = yield axios_1.default.post('https://api.ddpurse.com/v1/oauth2/get_access_token', data);
        if (log)
            console.log('==============access token result==============\n', accessTokenRequest.data);
        if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0)
            throw accessTokenRequest;
        else {
            DotWalletClass.appAccessToken = accessTokenRequest.data.data.access_token;
            return accessTokenRequest.data.data;
        }
    }
    catch (error) {
        console.log('==============ERROR==============\n', error);
    }
});
