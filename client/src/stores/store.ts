import { createContext, useContext } from "react";
import BasketStore from "./basketStore";
import CatalogStore from "./catalogStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";

interface Store {
  catalogStore: CatalogStore;
  basketStore: BasketStore;
  userStore: UserStore;
  commonStore: CommonStore;
}

export const store: Store = {
  catalogStore: new CatalogStore(),
  basketStore: new BasketStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}