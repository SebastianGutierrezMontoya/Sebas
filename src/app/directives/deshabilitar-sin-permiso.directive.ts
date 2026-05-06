import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { PermisosService } from '../services/permisos.service';

/**
 * Directiva para deshabilitar elementos basados en permisos
 * Uso: [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'create' }"
 *      [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'delete' }"
 */
@Directive({
  selector: '[appDeshabilitarSinPermiso]',
  standalone: true
})
export class DeshabilitarSinPermisoDirective implements OnInit {
  private permisoConfig: { moduloId: number; accion: 'read' | 'create' | 'update' | 'delete' } | null = null;

  constructor(
    private el: ElementRef,
    private permisosService: PermisosService
  ) {}

  @Input()
  set appDeshabilitarSinPermiso(config: { moduloId: number; accion: 'read' | 'create' | 'update' | 'delete' }) {
    this.permisoConfig = config;
    this.actualizarEstado();
  }

  ngOnInit(): void {
    // Actualizar estado cuando los permisos cambien
    this.permisosService.permisos$.subscribe(() => {
      this.actualizarEstado();
    });
  }

  private actualizarEstado(): void {
    if (!this.permisoConfig) {
      this.el.nativeElement.disabled = false;
      this.el.nativeElement.classList.remove('disabled');
      return;
    }

    const tienePermiso = this.permisosService.tienePermiso(
      this.permisoConfig.moduloId,
      this.permisoConfig.accion
    );

    if (!tienePermiso) {
      this.el.nativeElement.disabled = true;
      this.el.nativeElement.classList.add('disabled');
      this.el.nativeElement.title = `No tienes permiso para ${this.permisoConfig.accion}`;
    } else {
      this.el.nativeElement.disabled = false;
      this.el.nativeElement.classList.remove('disabled');
      this.el.nativeElement.title = '';
    }
  }
}
