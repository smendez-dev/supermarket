import { Product } from "./product.model";

export interface AddToCartDialogData {
    producto: Product;
}

export interface AddToCartDialogDataEvent {
    cartProduct: Product;
    updatedProduct: Product;
}
