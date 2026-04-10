import axios from "axios";  

// export const BASE_URL = "https://proconnectlinkedin-j4f7.onrender.com";

export const BASE_URL="http://localhost:9090";

export const clientServer = axios.create({
    baseURL: BASE_URL
});    