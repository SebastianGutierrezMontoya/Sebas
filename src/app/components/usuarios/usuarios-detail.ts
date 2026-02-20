import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuarios-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h3>Usuario detalle</h3>
      <p>ID: {{ id }}</p>
      <a routerLink="/usuarios">Volver al listado</a>
    </div>
  `,
})
export class UsuariosDetail {
  id: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(p => this.id = p.get('id'));
  }
}
