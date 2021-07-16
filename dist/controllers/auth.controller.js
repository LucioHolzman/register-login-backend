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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.signin = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Saving a new user
        const user = new User_1.default({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        user.password = yield user.encryptPassword(user.password);
        const savedUser = yield user.save();
        // Generating the token
        const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.JWT_SECRET || "tokentest");
        res.header("auth-token", token).json(savedUser);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("bad resquest");
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user exists
    try {
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(401).send("User not found");
        }
        // Checking if the password is correct
        if (user) {
            const correctPassword = yield user.validatePassword(req.body.password);
            if (!correctPassword) {
                return res.status(400).send("Incorrect password");
            }
            // Generating the token
            if (correctPassword) {
                const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || "tokentest", { expiresIn: "1d" });
                res.header("auth-token", token).json(user);
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send("bad resquest");
    }
});
exports.signin = signin;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.userId, { password: 0 });
        if (!user)
            return res.status(404).send("User not found");
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("bad resquest");
    }
});
exports.profile = profile;
//# sourceMappingURL=auth.controller.js.map