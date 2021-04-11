import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/model/product.model';
import { EventDriverService } from 'src/app/state/event.driver.service';
import { ActionEvent, ProductActionTypes } from 'src/app/state/product.state';

@Component({
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.css']
})
export class ProductsItemComponent implements OnInit {

  @Input() product?:Product;
  // @Output() eventEmitter:EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  constructor(private eventDrivenService:EventDriverService) { }

  ngOnInit(): void {
  }

  onSelect(product:Product){
    //this.eventEmitter.emit({type:ProductActionTypes.SELECT_PRODUCT,payload:product});
     this.eventDrivenService.publishEvent({type:ProductActionTypes.SELECT_PRODUCT,payload:product});
  }

  onEdit(product:Product){
    //this.eventEmitter.emit({type:ProductActionTypes.EDIT_PRODUCT,payload:product});
    this.eventDrivenService.publishEvent({type:ProductActionTypes.EDIT_PRODUCT,payload:product});
  }

  onDelete(product:Product){
    //this.eventEmitter.emit({type:ProductActionTypes.DELETE_PRODUCT,payload:product});
    this.eventDrivenService.publishEvent({type:ProductActionTypes.DELETE_PRODUCT,payload:product});
  }

}
