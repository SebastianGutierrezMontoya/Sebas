import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../models/models';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  banner = 'banner2.webp'
  imagen = 'imagen_defecto.png'

  usuario: any = null;
  isAuthenticated = false;
  errorMessage = '';

  categorias: Categoria[] = [];
  categorias2: Categoria[] = [];
  isLoading = false;

  productos: Productos[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private service: ProductosService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadProductos();
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });

 
  }

  loadCategorias(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        // console.log('Categorías cargadas:', data);
        this.categorias = data;
        this.isLoading = false;
           let z=1;
    for (let x of data) {
      if (z < 5) {
        this.categorias2.push(x);
      }
      
      z = z + 1;

    }
    // console.log(this.categorias2)
        this.cdr.detectChanges(); // Fuerza detección de cambios
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.errorMessage = 'Error al cargar las categorías';
        this.isLoading = false;
        this.cdr.detectChanges(); // Fuerza detección de cambios en error
      }
    });
  }


  loadProductos(): void {
    this.isLoading = true;
    this.errorMessage = '';



    this.service.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        console.log(data)
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar productos';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  navegar(id: string | undefined): void {

    this.router.navigate(['/catalogo', id]);
  }

  getNombreCategoria(catId: string): string {
    const categoria = this.categorias.find(cat => cat.cat_id === catId);
    return categoria ? categoria.cat_nombre : 'Categoría desconocida';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ejecutar(nombre: string, precio: number, id: string, stock: number){
   (window as any).addToCart(nombre, precio, id, stock);
}
}
