import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home_admin.html',
  // styleUrl: './home_admin.css',
})
export class Home_admin implements OnInit {


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

    if (!this.isAuthenticated) {
      this.router.navigate(['Home']);
    }

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
