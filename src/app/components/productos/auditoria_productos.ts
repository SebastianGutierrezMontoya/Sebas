import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductosAuditoriaService } from '../../services/productosauditoria.service';

@Component({
  selector: 'app-auditoria-productos',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auditoria_productos.html',
})
export class AuditoriaProductos {
  data: any[] = [];


  constructor(private service: ProductosAuditoriaService) {}
  

  ngOnInit() {
    this.service.getAuditoria()
      .subscribe(res => this.data = res);
    console.log(this.data);
    
  }


}
