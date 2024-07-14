"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductOne = exports.getProduct = void 0;
const getProduct = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    roll: 20,
                    age: 1 * 4,
                },
                {
                    id: 2,
                    roll: 30,
                    age: 2 * 4,
                },
            ]);
        }, 1000);
    });
};
exports.getProduct = getProduct;
const getProductOne = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                id: id,
                roll: `${id}2`,
                age: `${id}5`,
            });
        }, 2000);
    });
};
exports.getProductOne = getProductOne;
