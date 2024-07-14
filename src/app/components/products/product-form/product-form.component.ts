import { Component, Input, effect, inject } from '@angular/core';
import { IFeedBackMessage, IProduct, IFeedbackStatus, ICategory} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  @Input() title!: string;
  @Input() product: IProduct = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: {},
    id_category: 0
  };
  @Input() action: string = 'add'
  service = inject(ProductService);
  category_service = inject(CategoryService);

  category_list: ICategory[] = [];

  feedbackMessage: IFeedBackMessage = { type: IFeedbackStatus.default, message: '' };
  

  constructor() {
    this.category_service.getAllSignal();
    effect(() => {      
      this.category_list = this.category_service.categories$();
    });
  }

  handleAction (form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.product.category = { id: this.product.id_category};
      this.service[ this.action == 'add' ? 'saveProductSignal': 'updateProductSignal'](this.product).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `Product successfully ${this.action == 'add' ? 'added': 'updated'}`
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      })
    }
  }
}
