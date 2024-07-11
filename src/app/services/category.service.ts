import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<ICategory> {
  protected override source: string = 'categories';
  private categoryListSignal = signal<ICategory[]>([]);
  get categories$() {
    return this.categoryListSignal;
  }
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.categoryListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    });
  }
  saveCategorySignal (category: ICategory): Observable<any>{
    return this.add(category).pipe(
      tap((response: any) => {
        this.categoryListSignal.update( categories => [response, ...categories]);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }
  updateCategorySignal (category: ICategory): Observable<any>{
    return this.edit(category.id, category).pipe(
      tap((response: any) => {
        const updatedCategories = this.categoryListSignal().map(u => u.id === category.id ? response : u);
        this.categoryListSignal.set(updatedCategories);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }
  deleteCategorySignal (category: ICategory): Observable<any>{
    return this.del(category.id).pipe(
      tap((response: any) => {
        const updatedCategories = this.categoryListSignal().filter( (u:ICategory) => u.id !== category.id);
        this.categoryListSignal.set(updatedCategories);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }
}
