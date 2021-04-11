import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { Product } from 'src/app/model/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { EventDriverService } from 'src/app/state/event.driver.service';
import { ActionEvent, AppDataState, DataStateEnum, ProductActionTypes } from 'src/app/state/product.state';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<AppDataState<Product[]>>|null=null; 
  readonly DataStateEnum = DataStateEnum;

  constructor(private productService:ProductsService,private router:Router,private eventDrivenService:EventDriverService) { }

  ngOnInit(): void {
    this.eventDrivenService.sourceEventSubjectObservable.subscribe((actionEvent:ActionEvent)=>{
      this.onActionEvent(actionEvent);
    })
  }

  onGetAllProducts(){
    this.products$ = this.productService.getAllProducts().pipe(
      map(data=> {
        console.log(data);
        return ({dataState:DataStateEnum.LOADED, data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=> of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );

  }
  onGetSelectedProducts(){
    this.products$ = this.productService.getSelectedProducts().pipe(
      map(data=> {
        console.log(data);
        return ({dataState:DataStateEnum.LOADED, data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=> of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );
  }

  onGetAvailableProducts(){
    this.products$ = this.productService.getAvailableProducts().pipe(
      map(data=> {
        console.log(data);
        return ({dataState:DataStateEnum.LOADED, data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=> of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );
  }

  onSearch(dataForm:any){
    this.products$ = this.productService.searchProducts(dataForm.keyword).pipe(
      map(data=> {
        console.log(data);
        return ({dataState:DataStateEnum.LOADED, data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=> of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );
  }

  onSelect(p:Product){
    this.productService.select(p)
                       .subscribe(data=> {
                         p.selected=data.selected; 
                       })
  }

  onDelete(p:Product){
    let v = confirm("Etes vous sure de vouloir supprimer ?");
    if(v== true)
    this.productService.deleteProduct(p)
                       .subscribe(data=>{
                         this.onGetAllProducts();
                       })
  }

  onNewProduct(){
     this.router.navigateByUrl("/newProduct");
  }

  onEdit(p:Product){
    this.router.navigateByUrl("/editProduct/"+ p.id);
  }

  onActionEvent($event:ActionEvent){
      //console.log($event);
      switch($event.type){
         case ProductActionTypes.GET_ALL_PRODUCTS : this.onGetAllProducts(); break;
         case ProductActionTypes.GET_SELECTED_PRODUCTS : this.onGetSelectedProducts(); break;
         case ProductActionTypes.GET_AVAILABLE_PRODUCTS : this.onGetAvailableProducts(); break;
         case ProductActionTypes.SEARCH_PRODUCTS : this.onSearch($event.payload); break;
         case ProductActionTypes.NEW_PRODUCTS : this.onNewProduct(); break;
         case ProductActionTypes.SELECT_PRODUCT : this.onSelect($event.payload); break;
         case ProductActionTypes.DELETE_PRODUCT : this.onDelete($event.payload); break;
         case ProductActionTypes.EDIT_PRODUCT : this.onEdit($event.payload); break;
      }
  }

}
