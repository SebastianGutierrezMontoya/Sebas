import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Rutas públicas donde no debe aparecer el sidebar
  private publicRoutes = ['login', 'registro', 'Home', 'mi_perfil', 'mis_pedidos', 'detalle_pedido', 'catalogo'];
  
  private showSidebarSubject = new BehaviorSubject<boolean>(true);
  public showSidebar$: Observable<boolean> = this.showSidebarSubject.asObservable();

  private showNavbarSubject = new BehaviorSubject<boolean>(true);
  public showNavbar$: Observable<boolean> = this.showNavbarSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: any) => event.urlAfterRedirects)
      )
      .subscribe((url: string) => {
        this.updateLayoutVisibility(url);
      });
  }

  private updateLayoutVisibility(url: string): void {
    // Verifica si la URL actual está en las rutas públicas
    const isPublicRoute = this.publicRoutes.some(route => url.includes(route));
    
    this.showSidebarSubject.next(!isPublicRoute);
    this.showNavbarSubject.next(!isPublicRoute);
  }

  /**
   * Añade una nueva ruta pública donde no se debe mostrar el sidebar
   * @param route La ruta a añadir
   */
  public addPublicRoute(route: string): void {
    if (!this.publicRoutes.includes(route)) {
      this.publicRoutes.push(route);
    }
  }

  /**
   * Obtiene las rutas públicas actuales
   */
  public getPublicRoutes(): string[] {
    return this.publicRoutes;
  }
}
