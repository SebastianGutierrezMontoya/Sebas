import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { Pedidos } from '../../models/models';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { TienePermisoDirective } from '../../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../../services/permisos.service';


@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, TienePermisoDirective, DeshabilitarSinPermisoDirective],
  templateUrl: './pedidos.html',
})
export class Pedidoss implements OnInit {

  pedidos: Pedidos[] = [];

  isLoading = false
  errorMessage = '';

  showDeleteModal = false;
  pedidoToDelete: Pedidos | null = null;

  page = 1;

  MODULO_ID = 9; // Reemplaza con el ID del módulo de pedidos en tu sistema de permisos

  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private service: PedidosService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const search = this.form.value.search || '';
    this.service.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar pedidos';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(): void {
    this.page
    this.loadPedidos();
  }

  crearPedido(): void {
    this.router.navigate(['/pedidos/form']);
  }

  editarPedido(pedido: Pedidos): void {
    this.router.navigate(['/pedidos/form', pedido.ped_id]);
  }

  confirmarEliminar(pedido: Pedidos): void {
      if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
        alert('No tienes permiso para eliminar');
        return;
      }
    this.pedidoToDelete = pedido;
    this.showDeleteModal = true;
  }

  cancelarEliminar(): void {
    this.pedidoToDelete = null;
    this.showDeleteModal = false;
  }

  eliminarPedido(): void {
    if (!this.pedidoToDelete) return;
    this.isLoading = true;
    this.service.delete(this.pedidoToDelete.ped_id).subscribe({
      next: () => {
        this.loadPedidos();
        this.cancelarEliminar();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar pedido';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  siguiente(): void {
    this.page++;
    this.loadPedidos();
  }

  anterior(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPedidos();
    }
  }



}
