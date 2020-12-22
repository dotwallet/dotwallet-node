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
exports.refreshUserToken = exports.getUserInfo = exports.getUserToken = void 0;
const axios_1 = require("axios");
const config_1 = require("./config");
exports.getUserToken = (CLIENT_ID, SECRET) => {
    return (code, redirectUri, log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (log)
                console.log('==============got code==============\n', code);
            if (!code)
                throw Error('no code supplied. Supply one in the request body {code: <the_code>}');
            const data = {
                client_id: CLIENT_ID,
                client_secret: SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            };
            console.log(data);
            const accessTokenRequest = yield axios_1.default.post(`${config_1.DOTWALLET_API}/oauth2/get_access_token`, data);
            if (log)
                console.log('==============access token result==============\n', accessTokenRequest.data);
            if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0)
                throw accessTokenRequest;
            else {
                const result = Object.assign({}, accessTokenRequest.data.data);
                return result;
            }
        }
        catch (err) {
            if (log)
                console.log('==============ERROR==============\n', err);
        }
    });
};
// call refresh token if token is expired? same in autopay?
exports.getUserInfo = (userAccessToken, log) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userAccessToken}`,
            },
            method: 'POST',
        };
        const userInfoRequest = yield axios_1.default(`${config_1.DOTWALLET_API}/user/get_user_info`, options);
        if (log)
            console.log('==============user info result==============\n', userInfoRequest.data);
        return userInfoRequest.data.data;
    }
    catch (err) {
        if (log)
            console.log('==============ERROR==============\n', err);
    }
});
exports.refreshUserToken = (CLIENT_ID, SECRET) => {
    return (refreshToken, log) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = {
                client_id: CLIENT_ID,
                client_secret: SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            };
            const accessTokenRequest = yield axios_1.default.post(`${config_1.DOTWALLET_API}/oauth2/get_access_token`, data);
            if (log)
                console.log('==============refresh access token result==============\n', accessTokenRequest.data);
            if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0)
                throw accessTokenRequest;
            else {
                const result = Object.assign({}, accessTokenRequest.data.data);
                return result;
            }
        }
        catch (error) {
            if (log)
                console.log('==============ERROR==============\n', error);
        }
    });
};
