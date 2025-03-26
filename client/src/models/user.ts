import { Basket } from "./basket";

export interface User {
    email: string;
    token: string;
    username: string;
    displayName: string;
    basket?: Basket;
  }
  
  export interface LoginForm {
    username: string;
    password: string;
  }
  
  export interface RegisterForm {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }