import { Component, effect, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    CategoryFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  public search: String = '';
  public categoryList: ICategory[] = [];
  private service = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  public currentCategory: ICategory = {
    name: '',
    description: ''
  };
  
  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.categoryList = this.service.categories$();
    });
  }

  showDetail(category: ICategory, modal: any) {
    this.currentCategory = {...category}; 
    modal.show();
  }

  deleteCategory(category: ICategory) {
    this.service.deleteCategorySignal(category).subscribe({
      next: () => {
        this.snackBar.open('Category deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting category', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

}
