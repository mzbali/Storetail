import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {PaginatedItems} from "../models/pagination";
import {Product} from "../models/product";
import router from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true; // to allow cookies to be sent to server.

const responseBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;

    // Check if the user exists
    if (token) {
        // Set the Authorization header with the user's token
        config.headers!.Authorization = `Bearer ${token}`;
    }

    // Return the config object
    return config;
});

axios.interceptors.response.use(
    async (response: AxiosResponse) => {
        await sleep();
        const pagination = response.headers["pagination"];
        if (pagination) {
            response.data = new PaginatedItems<Product[]>(
                response.data,
                JSON.parse(pagination)
            );
        }
        return response;
    }, // just return the response
    async (error: AxiosError) => {
        const {response} = error;
        switch (response?.status) {
            case 400:
                if (response.data?.errors) {
                    const validationMessage: string[] = Object.values(
                        response.data.errors
                    );
                    throw validationMessage.flat(); // [["This is Problem 1"],["This is Problem 2"]] -> ["This is Problem 1", "This is Problem 2"]
                }
                toast.error(response.statusText);
                break;
            case 401:
                toast.error(response.statusText);
                break;
            case 404:
                await router.navigate("/not-found");
                break;
            case 500:
                await router.navigate("/server-error");
                break;
            default:
                break;
        }
        return Promise.reject(response);
    }
);

const requests = {
    get: (url: string, params?: URLSearchParams) =>
        axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
};

const Account = {
    login: (value: any) => requests.post("account/login", value),
    register: (value: any) => requests.post("account/register", value),
    currentUser: () => requests.get("account/currentUser")
};

const Catalog = {
    catalog: (params: URLSearchParams) => requests.get("products", params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get("products/filters"),
};

const Buggy = {
    get400Error: () => requests.get("buggy/bad-request"),
    get401Error: () => requests.get("buggy/unauthorised"),
    get404Error: () => requests.get("buggy/not-found"),
    get500Error: () => requests.get("buggy/server-error"),
    getValidationError: () => requests.get("buggy/validation-error"),
};

const Basket = {
    get: () => requests.get("basket"),
    addItems: (productId: number, quantity = 1) =>
        requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItems: (productId: number, quantity = 1) =>
        requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const agent = {
    Catalog,
    Buggy,
    Basket,
    Account
};

export default agent;
