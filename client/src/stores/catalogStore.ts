import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, Product, ProductParams } from "../models";


export default class CatalogStore {
  productRegistry = new Map<number, Product>();
  selectedProduct: Product | null = null;
  loadingInitial = false;
  loading = false;
  pagination: Pagination | null = null;
  brands: string[] = [];
  types: string[] = [];
  productParams: ProductParams = this.initializeParams();
  filtersLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  initializeParams(): ProductParams {
    return {
      orderBy: "name",
      pageNumber: 1,
      pageSize: 6,
      brands: [],
      types: []
    };
  }

  resetProductParams = () => {
    this.productParams = this.initializeParams();
  };

  setProductParams = (params: Partial<ProductParams>) => {
    this.productParams = { ...this.productParams, ...params };
  };

  setPageNumber = (pageNumber: number) => {
    this.productParams = { ...this.productParams, pageNumber };
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.productParams.pageNumber.toString());
    params.append("pageSize", this.productParams.pageSize.toString());
    params.append("orderBy", this.productParams.orderBy);
    if (this.productParams.searchTerm) 
      params.append("searchTerm", this.productParams.searchTerm);
    if (this.productParams.brands.length) 
      params.append("brands", this.productParams.brands.join(","));
    if (this.productParams.types.length) 
      params.append("types", this.productParams.types.join(","));
    return params;
  }

  get productsArray() {
    return Array.from(this.productRegistry.values());
  }

  loadProducts = async () => {
    this.loadingInitial = true;
    try {
      const response = await agent.Catalog.list(this.axiosParams);
      runInAction(() => {
        this.productRegistry.clear();
        response.items.forEach((product: any) => {
          this.productRegistry.set(product.id, product);
        });
        this.pagination = response.metaData;
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  loadProduct = async (id: number) => {
    let product = this.productRegistry.get(id);
    if (product) {
      this.selectedProduct = product;
      return product;
    } else {
      this.loadingInitial = true;
      try {
        const product = await agent.Catalog.details(id);
        runInAction(() => {
          this.productRegistry.set(product.id, product);
          this.selectedProduct = product;
          this.loadingInitial = false;
        });
        return product;
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loadingInitial = false;
        });
      }
    }
  };

  loadFilters = async () => {
    if (this.filtersLoaded) return;
    this.loading = true;
    try {
      const response = await agent.Catalog.fetchFilters();
      runInAction(() => {
        this.brands = response.brands;
        this.types = response.types;
        this.filtersLoaded = true;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedProduct = () => {
    this.selectedProduct = null;
  };
}