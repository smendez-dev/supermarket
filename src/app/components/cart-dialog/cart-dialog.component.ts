import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { CartDialogData, CartDialogDataColumns, CartDialogDataRow } from 'src/app/interfaces/cart-dialog.data';
import { Detail } from 'src/app/interfaces/detail.model';
import { Invoice } from 'src/app/interfaces/invoice.model';
import { Product } from 'src/app/interfaces/product.model';
import { DetailService } from 'src/app/services/detail.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {

  displayedColumns: string[] = CartDialogDataColumns.map((col) => col.key);
  columnsSchema: any = CartDialogDataColumns;
  dataSource = new MatTableDataSource<CartDialogDataRow>();
  groupedByIdProducts = [];
  onRemoveFromCart = new EventEmitter<number>();
  onBuyNowFromCart = new EventEmitter<number[]>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CartDialogData,
    private dialogRef: MatDialogRef<CartDialogComponent>,
    private productService: ProductService,
    private detailService: DetailService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.groupedByIdProducts = this.data.productos.reduce((r, a) => {
      r[a.idProducto] = r[a.idProducto] || [];
      r[a.idProducto].push(a);
      return r;
    }, Object.create(null));
    this.fillTableData();
  }

  removeFromCart(id: number): void {
    this.dataSource.data = this.dataSource.data.filter(row => row.idProducto !== id && row.canRemove);
    this.dataSource.data = this.dataSource.data.length > 0 ? [...this.dataSource.data, {
      total: this.dataSource.data.reduce((accumulator: any, object: CartDialogDataRow) => {
        return accumulator + object.total;
      }, 0),
      canRemove: false
    } as CartDialogDataRow] : [];
    this.onRemoveFromCart.emit(id);

    if (this.dataSource.data.length === 0) {
      this.dialogRef.close();
    }
  }

  buyNow(): void {
    let $details: Observable<Detail>[] = [];
    let productsToUpdateIds: number[] = [];
    this.dataSource.data.forEach(cartProduct => {
      if (cartProduct.canRemove) {
        const product = this.data.productos.find(product => product.idProducto === cartProduct.idProducto)!;
        let detail: Detail = {
          producto: product,
          subtotal: cartProduct.total,
          peso: cartProduct.isPLU ? cartProduct.peso : null,
          cantidad: !cartProduct.isPLU ? cartProduct.cantidad : null
        } as Detail;
        $details.push(this.detailService.addDetail(detail));
        productsToUpdateIds.push(product.idProducto);
      }
    });
    forkJoin(
      $details
    ).subscribe((detailResponses: Detail[]) => {
      const cashier = localStorage.getItem('username') || '';
      const invoice: Invoice = {
        total: this.dataSource.data.find(cartProduct => !cartProduct.canRemove)!.total,
        cajero: cashier,
        caja: parseInt(cashier.substring(cashier.length - 1), 10),
        fecha: new Date(),
        detalles: detailResponses.map(detailResponse => ({ idDetalle: detailResponse.idDetalle }))
      } as Invoice;
      this.invoiceService.addInvoice(invoice).subscribe(() => {
        this.onBuyNowFromCart.emit(productsToUpdateIds);
      });
    });
  }

  private fillTableData(): void {
    for (let [key] of Object.entries(this.groupedByIdProducts)) {
      const product = this.data.productos.find(product => product.idProducto.toString() === key)!;
      const isPLU = Boolean(product.plu);
      const weight = this.groupedByIdProducts[key].reduce((accumulator: any, object: Product) => {
        return accumulator + object.peso;
      }, 0);
      const quantity = this.groupedByIdProducts[key].reduce((accumulator: any, object: Product) => {
        return accumulator + object.cantidad;
      }, 0);

      this.dataSource.data = [{
        idProducto: product.idProducto,
        descripcion: product.descripcion,
        cantidadDescripcion: isPLU ? `${weight}g x ${product.precio}` : `${quantity}u x ${product.precio}`,
        cantidad: quantity,
        peso: weight,
        total: isPLU ? (weight * product.precio / 1000) : quantity * product.precio,
        canRemove: true,
        isPLU
      }, ...this.dataSource.data];
    }
    this.dataSource.data = [...this.dataSource.data, {
      total: this.dataSource.data.reduce((accumulator: any, object: CartDialogDataRow) => {
        return accumulator + object.total;
      }, 0),
      canRemove: false
    } as CartDialogDataRow];
  }
}
