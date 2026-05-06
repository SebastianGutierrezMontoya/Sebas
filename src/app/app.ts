import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Users } from './components/users/users';
// import { Usuarios } from './components/usuarios/usuarios';
import { UsuariosForm } from './components/usuarios/usuarios-form'; 
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Users, UsuariosForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('Sebas Gutierrez');
  count = 55;
  resultado = this.count > 5;


  usuario: any = null;
  isAuthenticated = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  
}
