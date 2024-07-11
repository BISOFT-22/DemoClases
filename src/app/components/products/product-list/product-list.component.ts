import { Component, effect, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    ProductFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  public search: String = '';
  public productList: IProduct[] = [];
  private service = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  public currentProduct: IProduct = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: {},
  };
  
  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.productList = this.service.products$();
    });
  }

  showDetail(product: IProduct, modal: any) {
    this.currentProduct = {...product}; 
    modal.show();
  }

  deleteProduct(product: IProduct) {
    this.service.deleteProductSignal(product).subscribe({
      next: () => {
        this.snackBar.open('Product deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting product', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

}
