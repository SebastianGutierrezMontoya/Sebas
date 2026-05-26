
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-carsidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './carsidebar.html',
//   styleUrl: './navbar.css',
})
export class Carsidebar implements OnInit {

    usuario: any = null;
    isAuthenticated = false;
    Carscript = 'cart-sidebar.js'

    constructor(
    public authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {



  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });

    this.loadScript('cart-sidebar.js');
  }

  private loadScript(scriptPath: string): void {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = true;
    document.body.appendChild(script);
  }

}