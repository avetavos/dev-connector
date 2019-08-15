"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
const App_1 = tslib_1.__importDefault(require("./App"));
const Authenticate_1 = tslib_1.__importDefault(require("./app/controllers/Authenticate"));
const Profile_1 = tslib_1.__importDefault(require("./app/controllers/Profile"));
const Post_1 = tslib_1.__importDefault(require("./app/controllers/Post"));
dotenv.config();
const app = new App_1.default([
    new Authenticate_1.default(),
    new Profile_1.default(),
    new Post_1.default()
]);
app.listen();
