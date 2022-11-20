import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddToCartDialogData, AddToCartDialogDataEvent } from 'src/app/interfaces/add-to-cart-dialog.data';
import { Product } from 'src/app/interfaces/product.model';

@Component({
  selector: 'app-add-to-cart-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrls: ['./add-to-cart-dialog.component.scss']
})
export class AddToCartDialogComponent implements OnInit {
  dialogTitle: string = '';
  onAddToCart = new EventEmitter<AddToCartDialogDataEvent>();

  form = this.fb.group({
    quantity: [
      0, 
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max((this.data.producto.plu ? this.data.producto.peso : this.data.producto.cantidad)!)
      ]
    ]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddToCartDialogData,
    private dialogRef: MatDialogRef<AddToCartDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dialogTitle = this.data.producto.plu ? 'Peso (g)' : 'Cantidad (u)';
  }

  get quantity() {
      return this.form.controls['quantity'];
  }

  addToCart() {
    let cartProduct: Product = {} as Product;
    if (this.data.producto.plu) {
      this.data.producto.peso = this.data.producto.peso! - this.quantity.value!;
      cartProduct = {...this.data.producto, peso: this.quantity.value!};
    }
    if (this.data.producto.ean) {
      this.data.producto.cantidad = this.data.producto.cantidad! - this.quantity.value!;
      cartProduct = {...this.data.producto, cantidad: this.quantity.value!};
    }

    this.onAddToCart.emit({
      cartProduct,
      updatedProduct: this.data.producto
    });

    this.dialogRef.close();
  }
}
