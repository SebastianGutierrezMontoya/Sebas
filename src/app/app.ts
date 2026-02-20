import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Users } from './components/users/users';
import { Usuarios } from './components/usuarios/usuarios';
import { UsuariosForm } from './components/usuarios/usuarios-form'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Users, Usuarios, UsuariosForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Sebas Gutierrez');
  count = 55;
  resultado = this.count > 5;
}
