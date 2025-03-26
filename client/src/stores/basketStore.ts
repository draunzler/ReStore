import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Basket } from "../models";

export default class BasketStore {
  basket: Basket | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get basketCount() {
    if (this.basket) return this.basket.items.reduce((sum, item) => sum + item.quantity, 0);
    return 0;
  }

  get basketTotal() {
    if (this.basket) return this.basket.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return 0;
  }

  loadBasket = async () => {
    this.loading = true;
    try {
      const basket = await agent.basket.get();
      runInAction(() => {
        this.basket = basket;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  addItem = async (productId: number, quantity = 1) => {
    this.loading = true;
    try {
      const basket = await agent.basket.addItem(productId, quantity);
      runInAction(() => {
        this.basket = basket;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  removeItem = async (productId: number, quantity = 1) => {
    this.loading = true;
    try {
      await agent.basket.removeItem(productId, quantity);
      runInAction(() => {
        if (!this.basket) return;
        
        const item = this.basket.items.find(i => i.productId === productId);
        if (item) {
          item.quantity -= quantity;
          if (item.quantity <= 0) {
            this.basket.items = this.basket.items.filter(i => i.productId !== productId);
            if (this.basket.items.length === 0) this.basket = null;
          }
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}