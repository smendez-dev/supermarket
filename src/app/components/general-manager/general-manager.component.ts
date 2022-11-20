import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Area } from 'src/app/interfaces/area.model';
import { Product, ProductColumns } from 'src/app/interfaces/product.model';
import { AreaService } from 'src/app/services/area.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-general-manager',
  templateUrl: './general-manager.component.html',
  styleUrls: ['./general-manager.component.scss']
})
export class GeneralManagerComponent implements OnInit {
  displayedColumns: string[] = ProductColumns.map((col) => col.key);
  columnsSchema: any = ProductColumns;
  dataSource = new MatTableDataSource<Product>();
  areas: Area[] = [];
  pageTitle: string = '';

  constructor(public dialog: MatDialog, private productService: ProductService, private areaService: AreaService) {}

  ngOnInit() {
    this.pageTitle = (localStorage.getItem('username') || '').replace(/_+/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    this.areaService.getAreas().subscribe((areas: Area[]) => {
      this.areas = areas;
    });
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
        row.isAdd = false;
      });
    } else {
      this.productService.updateProduct(row.idProducto, row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    const newRow: Product = {
      idProducto: 0,
      area: {} as Area,
      descripcion: '',
      precio: 0,
      isEdit: true,
      isAdd: true,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (u: Product) => u.idProducto !== id
      );
    });
  }

  disableSubmit(product: Product) {
    return !((this.isValidPlu(product) || this.isValidEan(product)) && product.descripcion && product.precio > 0 && Object.keys(product.area).length);
  }

  disableInputField(product: Product, col: any) {
    this.resetFields(product);
    return Boolean(product.plu && (col.key === 'ean' || col.key === 'cantidad')) || Boolean(product.ean && (col.key === 'plu' || col.key === 'peso'));
  }

  compareItems(i1: any, i2: any) {
    return i1 && i2 && i1.idArea === i2.idArea;
  }

  displayRemove(product: Product) {
    return product.plu && product.peso === 0 || product.ean && product.cantidad === 0;
  }

  private isValidPlu(product: Product) {
    return product.plu && 999 < product.plu && product.plu < 100000 && product.peso && this.isUniquePlu(product);
  }

  private isValidEan(product: Product) {
    return product.ean && 999999999999 < product.ean && product.ean < 10000000000000 && product.cantidad && this.isUniqueEan(product);
  }

  private resetFields(product: Product) {
    product.cantidad = product.plu ? undefined : product.cantidad;
    product.peso = product.ean ? undefined : product.peso;
  }

  private isUniquePlu(product: Product) {
    return this.dataSource.data.map(x => x.plu?.toString()).filter(x => x === product.plu).length <= 1;
  }

  private isUniqueEan(product: Product) {
    return this.dataSource.data.map(x => x.ean?.toString()).filter(x => x === product.ean).length <= 1;
  }
}
