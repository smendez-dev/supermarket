import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Area } from 'src/app/interfaces/area.model';
import { Product, ProductColumns } from 'src/app/interfaces/product.model';
import { AreaService } from 'src/app/services/area.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-area-manager',
  templateUrl: './area-manager.component.html',
  styleUrls: ['./area-manager.component.scss']
})
export class AreaManagerComponent {
  displayedColumns: string[] = ProductColumns.map((col) => col.key);
  columnsSchema: any = ProductColumns;
  selectedAreaDataSource = new MatTableDataSource<Product>();
  areas: Area[] = [];
  selectedArea: string = '';
  remainingAreas: string[] = [];
  remainingAreaDataSources: Map<string, MatTableDataSource<Product>> = new Map();
  pageTitle: string = '';

  constructor(public dialog: MatDialog, private productService: ProductService, private areaService: AreaService) {}

  ngOnInit() {
    const username = (localStorage.getItem('username') || '');
    const areaName = username.replace('gerente_','').replace(/_+/g, ' ');
    this.selectedArea = areaName.toUpperCase();
    this.pageTitle = username.replace(/_+/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    this.setAreas(areaName);
    this.setDatasources();
  }

  filterPredicate(data: Product, filter: string): boolean {
    return data.plu?.toString().toLowerCase().includes(filter) || data.ean?.toString().toLowerCase().includes(filter) || data.descripcion.toLowerCase().includes(filter);
  };

  applyFilter(event: Event, dataSource: MatTableDataSource<Product>) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
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
    this.selectedAreaDataSource.data = [newRow, ...this.selectedAreaDataSource.data];
  }

  removeRow(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.selectedAreaDataSource.data = this.selectedAreaDataSource.data.filter(
        (u: Product) => u.idProducto !== id
      );
    });
  }

  disableSubmit(product: Product) {
    return !((this.isValidPlu(product) || this.isValidEan(product)) && product.descripcion && product.precio > 0 && Object.keys(product.area).length);
  }

  disableInputField(product: Product, col: any) {
    this.resetFields(product);
    return Boolean(col.key === 'plu') || Boolean(col.key === 'ean') || Boolean(product.plu && (col.key === 'ean' || col.key === 'cantidad')) || Boolean(product.ean && (col.key === 'plu' || col.key === 'peso'));
  }

  compareItems(i1: any, i2: any) {
    return i1 && i2 && i1.idArea === i2.idArea;
  }

  private setAreas(areaName: string) {
    this.areaService.getAreas().subscribe((areas: Area[]) => {
      this.areas = areas;
      this.remainingAreas = this.areas.filter(area => area.nombre !== areaName).map(x => x.nombre);
    });
  }

  private setDatasources() {
    this.productService.getProducts().subscribe((res: Product[]) => {
      this.selectedAreaDataSource.data = res.filter(product => product.area.nombre === this.selectedArea.toLowerCase());
      this.remainingAreas.forEach(area => {
        const dataSource = new MatTableDataSource<Product>();
        dataSource.data = res.filter(product => product.area.nombre === area.toLowerCase());
        dataSource.filterPredicate = this.filterPredicate;
        this.remainingAreaDataSources.set(area.toLowerCase(), dataSource);
      });
    });
    this.selectedAreaDataSource.filterPredicate = this.filterPredicate;
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
    return this.selectedAreaDataSource.data.map(x => x.plu?.toString()).filter(x => x === product.plu).length <= 1;
  }

  private isUniqueEan(product: Product) {
    return this.selectedAreaDataSource.data.map(x => x.ean?.toString()).filter(x => x === product.ean).length <= 1;
  }
}
