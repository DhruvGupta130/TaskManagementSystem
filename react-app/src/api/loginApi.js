import axios from "axios";
import {API_BASE_URL} from "./config.js";

const loginApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default loginApi;