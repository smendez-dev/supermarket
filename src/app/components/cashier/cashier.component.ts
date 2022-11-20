import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddToCartDialogDataEvent } from 'src/app/interfaces/add-to-cart-dialog.data';
import { Area } from 'src/app/interfaces/area.model';
import { Product, ProductColumns } from 'src/app/interfaces/product.model';
import { ProductService } from 'src/app/services/product.service';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit {
  displayedColumns: string[] = ProductColumns.map((col) => col.key);
  columnsSchema: any = ProductColumns;
  dataSource = new MatTableDataSource<Product>();
  cartProducts: Product[] = [];
  pageTitle: string = '';

  constructor(public dialog: MatDialog, private productService: ProductService) {}

  ngOnInit() {
    this.pageTitle = (localStorage.getItem('username') || '').replace(/_+/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    this.productService.getProducts().subscribe((res: any) => {
      this.dataSource.data = res;
    });
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.plu?.toString().toLowerCase().includes(filter) || data.ean?.toString().toLowerCase().includes(filter) || data.descripcion.toLowerCase().includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editRow(row: Product) {
    if (row.idProducto === 0) {
      this.productService.addProduct(row).subscribe((newProduct: Product) => {
        row.idProducto = newProduct.idProducto;
        row.isEdit = false;
      });
    } else {
      this.productService.updateProduct(1, row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    const newRow: Product = {
      idProducto: 0,
      area: {} as Area,
      plu: 0,
      ean: 0,
      descripcion: '',
      peso: 0,
      precio: 0,
      cantidad: 0,
      isEdit: true,
      isAdd: true
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  compareItems(i1: any, i2: any) {
    return i1 && i2 && i1.idArea === i2.idArea;
  }

  addToCart(producto: Product) {
    const ref = this.dialog.open(AddToCartDialogComponent, {
      data: {
        producto,
      },
      width: '20%'
    });
    const sub = ref.componentInstance.onAddToCart.subscribe((data: AddToCartDialogDataEvent) => {
      this.cartProducts.unshift(data.cartProduct);
      const updatedProductIndex = this.dataSource.data.findIndex((product) => product.idProducto === data.updatedProduct.idProducto);
      this.dataSource.data[updatedProductIndex] = data.updatedProduct;
    });
    ref.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  viewCart() {
    const ref = this.dialog.open(CartDialogComponent, {
      data: {
        productos: this.cartProducts,
      },
      width: '80%'
    });
    const removeCartSub = ref.componentInstance.onRemoveFromCart.subscribe(async (id) => {
      const productToDelete = await this.productService.getProductById(id).toPromise();
      const productIndex = this.dataSource.data.findIndex((product) => product.idProducto === productToDelete!.idProducto);
      const dataSourceClone = JSON.parse(JSON.stringify(this.dataSource.data));
      dataSourceClone.splice(productIndex, 1, productToDelete!);
      this.dataSource.data = dataSourceClone;
      this.cartProducts = this.cartProducts.filter(cartProduct => cartProduct.idProducto !== id);
    });
    const buyCartSub = ref.componentInstance.onBuyNowFromCart.subscribe(async (ids) => {
      const productsToUpdate = this.dataSource.data.filter(({ idProducto }) => ids.includes(idProducto));
      productsToUpdate.forEach(productToUpdate => {
        this.productService.updateProduct(productToUpdate.idProducto, productToUpdate).subscribe();
      });
    });
    ref.afterClosed().subscribe(() => {
      removeCartSub.unsubscribe();
      buyCartSub.unsubscribe();
    });
  }
}
