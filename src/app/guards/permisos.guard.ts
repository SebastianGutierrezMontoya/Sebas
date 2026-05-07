import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { PermisosService } from '../services/permisos.service';
import { AuthService } from '../services/auth.service';

/**
 * Guardia que verifica permisos antes de acceder a una ruta
 * Uso en rutas:
 * {
 *   path: 'usuarios',
 *   component: UsuariosComponent,
 *   canActivate: [permisosGuard],
 *   data: { moduloId: 1, accion: 'read' }
 * }
 */
export const permisosGuard: CanActivateFn = (route, state) => {
  const permisosService = inject(PermisosService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Obtener datos de la ruta
  const moduloId = route.data['moduloId'];
  const accion = route.data['accion'] || 'read';

  // Si no hay moduloId, permitir acceso (ruta sin restricciones)
  if (!moduloId) {
    return true;
  }

  // Verificar permiso
  const tienePermiso = permisosService.tienePermiso(moduloId, accion);

  if (!tienePermiso) {
    alert('Acceso denegado: No tienes permiso para esta acción');
    console.warn(`Acceso denegado: Sin permiso ${accion} en módulo ${moduloId}`);
    router.navigate(['/']);
    return false;
  }

  return true;
};
