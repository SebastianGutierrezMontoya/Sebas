import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermisosService } from '../services/permisos.service';

/**
 * Directiva para mostrar/ocultar elementos basados en permisos
 * Uso: *appTienePermiso="{ moduloId: 1, accion: 'create' }"
 *      *appTienePermiso="{ moduloId: 1, accion: 'read' }"
 *      *appTienePermiso="{ moduloId: 1, accion: 'update' }"
 *      *appTienePermiso="{ moduloId: 1, accion: 'delete' }"
 */
@Directive({
  selector: '[appTienePermiso]',
  standalone: true
})
export class TienePermisoDirective implements OnInit {
  private permisoConfig: { moduloId: number; accion: 'read' | 'create' | 'update' | 'delete' } | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permisosService: PermisosService
  ) {}

  @Input()
  set appTienePermiso(config: { moduloId: number; accion: 'read' | 'create' | 'update' | 'delete' }) {
    this.permisoConfig = config;
    this.actualizarVista();
  }

  ngOnInit(): void {
    // Actualizar vista cuando los permisos cambien
    this.permisosService.permisos$.subscribe(() => {
      this.actualizarVista();
    });
  }

  private actualizarVista(): void {
    if (!this.permisoConfig) {
      this.viewContainer.clear();
      return;
    }

    const tienePermiso = this.permisosService.tienePermiso(
      this.permisoConfig.moduloId,
      this.permisoConfig.accion
    );

    if (tienePermiso) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
