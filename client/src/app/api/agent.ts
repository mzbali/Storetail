import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../../main';

axios.defaults.baseURL = 'http://localhost:5000/api/';

const responseBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    await sleep();
    return response;
  }, // just return the response
  async (error: AxiosError) => {
    const { response } = error;
    switch (response?.status) {
      case 400:
        console.log(response);
        if (response.data?.errors) {
          const validationMessage: string[] = Object.values(
            response.data.errors
          );
          console.log(validationMessage.flat());
          throw validationMessage.flat(); // [["This is Problem 1"],["This is Problem 2"]] -> ["This is Problem 1", "This is Problem 2"]
        }
        toast.error(response.statusText);
        break;
      case 401:
        toast.error(response.statusText);
        break;
      case 404:
        history.push('/not-found');
        break;
      case 500:
        history.push('/server-error', { data: response.data });
        break;
      default:
        break;
    }
    return Promise.reject(response);
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  catalog: () => requests.get('products'),
  details: (id: number) => requests.get(`products/${id}`),
};

const Buggy = {
  get400Error: () => requests.get('buggy/bad-request'),
  get401Error: () => requests.get('buggy/unauthorised'),
  get404Error: () => requests.get('buggy/not-found'),
  get500Error: () => requests.get('buggy/server-error'),
  getValidationError: () => requests.get('buggy/validation-error'),
};

const agent = {
  Catalog,
  Buggy,
};

export default agent;
