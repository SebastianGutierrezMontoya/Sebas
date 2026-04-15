import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductosAuditoriaService } from '../../services/productosauditoria.service';
import { ProductosAuditoria } from '../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auditoria-productos',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auditoria_productos.html',
})
export class AuditoriaProductos implements OnInit {
  auditoria: any[] = [];


  constructor(private service: ProductosAuditoriaService) {}
  

  ngOnInit() {
    this.service.getAuditoria().subscribe({
      next: (data) => {
        this.auditoria = data;
        console.log('Auditoría recibida:', data);
      },
      error: (err) => console.error('Error al obtener auditoría:', err)
    });
  }


}
