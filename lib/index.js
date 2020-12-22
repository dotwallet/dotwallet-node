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
// import { Request, Response, NextFunction } from 'express';
const userAuth_1 = require("./userAuth");
const order_1 = require("./order");
const autopayment_1 = require("./autopayment");
const saveData_1 = require("./saveData");
const appAuth_1 = require("./appAuth");
class DotWallet {
    constructor(appId, secret) {
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            // functions that us the app token need to be repopulated with the token each time. ones that only use the secrets are static and don't
            appAuth_1.getAppAccessToken(this.CLIENT_ID, this.SECRET, this, true);
            // create a function that updates the functions that use the appAccessToken
            setInterval(() => { });
            // this.refreshAccess = refreshAccess(this.CLIENT_ID, this);
            this.handleOrder = order_1.handleOrder(this.CLIENT_ID, this.SECRET);
            this.getOrderStatus = order_1.getOrderStatus(this.CLIENT_ID, this.SECRET);
            this.autopayment = autopayment_1.autopayment(this.SECRET);
            this.getHostedAccount = saveData_1.getHostedAccount(this.CLIENT_ID, this.SECRET);
            this.hostedAccountBalance = saveData_1.hostedAccountBalance(this.CLIENT_ID, this.SECRET);
            this.saveData = saveData_1.saveData(this.CLIENT_ID, this.SECRET);
        });
        this.CLIENT_ID = appId;
        this.SECRET = secret;
        this.appAccessToken = undefined;
        this.start();
        this.getUserToken = userAuth_1.getUserToken(this.CLIENT_ID, this.SECRET);
        this.getUserInfo = userAuth_1.getUserInfo;
        // this.refreshAccess = refreshAccess(this.CLIENT_ID);
        this.handleOrder = order_1.handleOrder(this.CLIENT_ID, this.SECRET);
        this.getOrderStatus = order_1.getOrderStatus(this.CLIENT_ID, this.SECRET);
        this.autopayment = autopayment_1.autopayment(this.SECRET);
        this.getHostedAccount = saveData_1.getHostedAccount(this.CLIENT_ID, this.SECRET);
        this.hostedAccountBalance = saveData_1.hostedAccountBalance(this.CLIENT_ID, this.SECRET);
        this.saveData = saveData_1.saveData(this.CLIENT_ID, this.SECRET);
    }
}
const caller = (appId, secret) => new DotWallet(appId, secret);
module.exports = caller;
