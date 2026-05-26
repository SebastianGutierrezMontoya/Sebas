import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/navbar/sidebar';
import { Carsidebar } from './components/navbar/carsidebar';
import { Users } from './components/users/users';
// import { Usuarios } from './components/usuarios/usuarios';
import { UsuariosForm } from './components/usuarios/usuarios-form'; 
import { AuthService } from './services/auth.service';
import { LayoutService } from './services/layout.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar, Carsidebar, Users, UsuariosForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit{
  protected readonly title = signal('Sebas Gutierrez');
  count = 55;
  resultado = this.count > 5;


  usuario: any = null;
  isAuthenticated = false;
  showSidebar = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });
    this.layoutService.showSidebar$.subscribe(showSidebar => {
      this.showSidebar = showSidebar;
    });
    // console.log('Usuario en AppComponent:', this.usuario);
    // console.log('Sidebar visible en AppComponent:', this.showSidebar);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  
}
