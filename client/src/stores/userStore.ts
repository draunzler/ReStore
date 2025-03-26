import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { store } from "./store";
import { LoginForm, RegisterForm, User } from "../models";

export default class UserStore {
  user: User | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (data: LoginForm) => {
    this.loading = true;
    try {
      const user = await agent.Account.login(data);
      this.setUser(user);
      runInAction(() => this.loading = false);
      router.navigate('/catalog');
    } catch (error) {
      console.log(error);
      runInAction(() => this.loading = false);
      throw error;
    }
  };

  register = async (data: RegisterForm) => {
    this.loading = true;
    try {
      const user = await agent.Account.register(data);
      this.setUser(user);
      runInAction(() => this.loading = false);
      router.navigate('/catalog');
    } catch (error) {
      console.log(error);
      runInAction(() => this.loading = false);
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    localStorage.removeItem('jwt');
    this.user = null;
    router.navigate('/');
  };

  getUser = async () => {
    this.loading = true;
    try {
      const user = await agent.Account.currentUser();
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => this.loading = false);
    }
  };

  setUser = (user: User) => {
    if (user.token) {
      store.commonStore.setToken(user.token);
    }
    this.user = user;
  };
}