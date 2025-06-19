import { Observable } from "rxjs";

export interface Variant {
  size: string;
  color: string;
  stock: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  subCategory?: string;
  gender?: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: Variant[];
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  variants?: Variant[];
}

export interface ProductID {
  id: string;
}

export interface ProductFilter {
  page?: number;
  pageSize?: number;
  category?: string;
  brand?: string;
  subCategory?: string;
  name?: string;
}

export interface UpdateInventoryRequest {
  productId: string;
  variants: Variant[];
}

export interface Response {
  code: number;
  status: string;
  timestamp: string;
  data: string;
  error: string;
}

export interface ProductServiceGrpc {
  CreateProduct(request: CreateProductRequest): Observable<Response>;
  UpdateProduct(request: UpdateProductRequest): Observable<Response>;
  GetProduct(request: ProductID): Observable<Response>;
  ListProducts(request: ProductFilter): Observable<Response>;
  DeleteProduct(request: ProductID): Observable<Response>;
  UpdateInventory(request: UpdateInventoryRequest): Observable<Response>;
}