"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, _) => {
    console.error("Error", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
};
exports.errorHandler = errorHandler;
