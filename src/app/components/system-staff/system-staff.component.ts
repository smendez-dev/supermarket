import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Area, AreaColumns } from 'src/app/interfaces/area.model';
import { Detail, DetailColumns } from 'src/app/interfaces/detail.model';
import { Invoice, InvoiceColumns } from 'src/app/interfaces/invoice.model';
import { Movement, MovementColumns } from 'src/app/interfaces/movement.model';
import { Product, ProductColumns } from 'src/app/interfaces/product.model';
import { Sale, SaleColumns } from 'src/app/interfaces/sale.model';
import { AreaService } from 'src/app/services/area.service';
import { DetailService } from 'src/app/services/detail.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { MovementService } from 'src/app/services/movement.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-system-staff',
  templateUrl: './system-staff.component.html',
  styleUrls: ['./system-staff.component.scss']
})
export class SystemStaffComponent {
  productDisplayedColumns: string[] = ProductColumns.map((col) => col.key);
  productColumnsSchema: any = ProductColumns;
  productDataSource = new MatTableDataSource<Product>();
  areaDisplayedColumns: string[] = AreaColumns.map((col) => col.key);
  areaColumnsSchema: any = AreaColumns;
  areaDataSource = new MatTableDataSource<Area>();
  detailDisplayedColumns: string[] = DetailColumns.map((col) => col.key);
  detailColumnsSchema: any = DetailColumns;
  detailDataSource = new MatTableDataSource<Detail>();
  invoiceDisplayedColumns: string[] = InvoiceColumns.map((col) => col.key);
  invoiceColumnsSchema: any = InvoiceColumns;
  invoiceDataSource = new MatTableDataSource<Invoice>();
  movementDisplayedColumns: string[] = MovementColumns.map((col) => col.key);
  movementColumnsSchema: any = MovementColumns;
  movementDataSource = new MatTableDataSource<Movement>();
  saleDisplayedColumns: string[] = SaleColumns.map((col) => col.key);
  saleColumnsSchema: any = SaleColumns;
  saleDataSource = new MatTableDataSource<Sale>();
  areas: Area[] = [];
  pageTitle: string = '';

  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private areaService: AreaService,
    private detailService: DetailService,
    private invoiceService: InvoiceService,
    private movementService: MovementService,
    private saleService: SaleService
  ) {}

  ngOnInit() {
    this.pageTitle = (localStorage.getItem('username') || '').replace(/_+/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    
    this.productService.getProducts().subscribe((res: any) => {
      this.productDataSource.data = res;
    });
    this.productDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.plu?.toString().toLowerCase().includes(filter) || data.ean?.toString().toLowerCase().includes(filter) || data.descripcion.toLowerCase().includes(filter);
    };
    this.areaService.getAreas().subscribe((areas: Area[]) => {
      this.areaDataSource.data = areas;
    });
    this.areaDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.nombre.toLowerCase().includes(filter);
    };
    this.detailService.getDetails().subscribe((details: Detail[]) => {
      this.detailDataSource.data = details;
    });
    this.detailDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.producto.descripcion.toLowerCase().includes(filter) || data.subtotal.toString().toLowerCase().includes(filter);
    };
    this.invoiceService.getInvoices().subscribe((invoices: Invoice[]) => {
      this.invoiceDataSource.data = invoices;
    });
    this.invoiceDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.total.toString().toLowerCase().includes(filter) || data.cajero.toString().toLowerCase().includes(filter) || data.caja.toString().toLowerCase().includes(filter);
    };
    this.movementService.getMovements().subscribe((res: any) => {
      this.movementDataSource.data = res;
    });
    this.movementDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.descripcion?.toString().toLowerCase().includes(filter) || data.usuario?.toString().toLowerCase().includes(filter) || data.tablaAfectada.toLowerCase().includes(filter);
    };
    this.saleService.getSales().subscribe((res: any) => {
      this.saleDataSource.data = res;
    });
    this.saleDataSource.filterPredicate = function(data, filter: string): boolean {
      return data.cajero?.toString().toLowerCase().includes(filter) || data.descripcion?.toString().toLowerCase().includes(filter);
    };
  }

  applyProductFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLowerCase();
  }

  editProductRow(row: Product) {
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

  addProductRow() {
    const newRow: Product = {
      idProducto: 0,
      area: {} as Area,
      descripcion: '',
      precio: 0,
      isEdit: true,
      isAdd: true,
    };
    this.productDataSource.data = [newRow, ...this.productDataSource.data];
  }

  removeProductRow(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.productDataSource.data = this.productDataSource.data.filter(
        (u: Product) => u.idProducto !== id
      );
    });
  }

  disableProductSubmit(product: Product) {
    return !((this.isValidPlu(product) || this.isValidEan(product)) && product.descripcion && product.precio > 0 && Object.keys(product.area).length);
  }

  disableProductInputField(product: Product, col: any) {
    this.resetFields(product);
    return Boolean(product.plu && (col.key === 'ean' || col.key === 'cantidad')) || Boolean(product.ean && (col.key === 'plu' || col.key === 'peso'));
  }

  applyAreaFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.areaDataSource.filter = filterValue.trim().toLowerCase();
  }

  editAreaRow(row: Area) {
    if (row.idArea === 0) {
      this.areaService.addArea(row).subscribe((newArea: Area) => {
        row.idArea = newArea.idArea;
        row.isEdit = false;
      });
    } else {
      this.areaService.updateArea(row.idArea!, row).subscribe(() => (row.isEdit = false));
    }
  }

  addAreaRow() {
    const newRow: Area = {
      idArea: 0,
      nombre: '',
      isEdit: true,
    };
    this.areaDataSource.data = [newRow, ...this.areaDataSource.data];
  }

  removeAreaRow(id: number) {
    this.areaService.deleteArea(id).subscribe(() => {
      this.areaDataSource.data = this.areaDataSource.data.filter(
        (u: Area) => u.idArea !== id
      );
    });
  }

  disableAreaSubmit(area: Area) {
    return !area.nombre;
  }

  applyDetailFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.detailDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyInvoiceFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.invoiceDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyMovementFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.movementDataSource.filter = filterValue.trim().toLowerCase();
  }

  applySaleFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.saleDataSource.filter = filterValue.trim().toLowerCase();
  }

  compareItems(i1: any, i2: any) {
    return i1 && i2 && i1.idArea === i2.idArea;
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
    return this.productDataSource.data.map(x => x.plu?.toString()).filter(x => x === product.plu).length <= 1;
  }

  private isUniqueEan(product: Product) {
    return this.productDataSource.data.map(x => x.ean?.toString()).filter(x => x === product.ean).length <= 1;
  }
}
