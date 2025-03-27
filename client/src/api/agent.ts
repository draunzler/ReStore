import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { store } from '../stores/store';
import { router } from '../router/Routes';
import { PaginatedResponse, Product, Basket, User } from '../models';

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'https://restore-crfi.onrender.com/api/';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(async response => {
  if (process.env.NODE_ENV === 'development') await sleep();
  const pagination = response.headers['pagination'];
  if (pagination) {
    response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
    return response;
  }
  return response;
}, (error: AxiosError) => {
  const { data, status } = error.response as AxiosResponse;
  switch (status) {
    case 400:
      if (data.errors) {
        const modelStateErrors: string[] = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateErrors.push(data.errors[key]);
          }
        }
        throw modelStateErrors.flat();
      }
      toast.error(data.title);
      break;
    case 401:
      toast.error('Unauthorized');
      break;
    case 403:
      toast.error('Forbidden');
      break;
    case 404:
      router.navigate('/not-found');
      break;
    case 500:
      toast.error('Server error');
      break;
    default:
      break;
  }
  return Promise.reject(error);
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: <T>(url: string, params?: URLSearchParams) => 
    axios.get<T>(url, { params }).then(responseBody),
  post: <T>(url: string, body: {}) => 
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => 
    axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => 
    axios.delete<T>(url).then(responseBody)
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get<PaginatedResponse<Product>>('Products', params),
  details: (id: number) => requests.get<Product>(`Products/${id}`),
  fetchFilters: () => requests.get<{ brands: string[], types: string[] }>('Products/filters')
};

const basket = {
  get: () => requests.get<Basket>('Basket'),
  addItem: (productId: number, quantity = 1) => 
    requests.post<Basket>(`Basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) => 
    requests.delete<void>(`Basket?productId=${productId}&quantity=${quantity}`)
};

const Account = {
  login: (values: any) => requests.post<User>('Account/login', values),
  register: (values: any) => requests.post<User>('Account/register', values),
  currentUser: () => requests.get<User>('Account/currentUser')
};

const agent = {
  Catalog,
  basket,
  Account
};

export default agent;
