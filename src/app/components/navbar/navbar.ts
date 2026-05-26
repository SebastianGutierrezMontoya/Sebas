import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  usuario: any = null;
  isAuthenticated = false;
  hasPermissions$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Crear un observable que emita true si hay al menos un permiso
    this.hasPermissions$ = this.authService.permisos$.pipe(
      map(permisos => Array.isArray(permisos) && permisos.length > 0)
    );


  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });
    console.log(this.usuario)
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  mi_perfil(): void {
    this.router.navigate(['/mi_perfil', this.usuario.id_usuario]);
  }
}

