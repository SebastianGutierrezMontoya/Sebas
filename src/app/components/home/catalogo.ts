import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { ProductosService } from '../../services/productos.service';
import { Productos } from '../../models/models';
import { ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {

    banner = 'banner2.webp'
  imagen = 'imagen_defecto.png'

  usuario: any = null;
  isAuthenticated = false;
  errorMessage = '';

  categorias: Categoria[] = [];
//   categorias2: Categoria[] = [];
  isLoading = false;

  productos: Productos[] = [];
  catId = '';

  prod_nombre: string = '';

  productoSeleccionado: any = null;

    modalVisible: boolean = false;

  constructor(
    private categoriaService: CategoriaService,
    private service: ProductosService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}



  ngOnInit(): void {
    this.loadCategorias();

    this.route.params.subscribe(params => {
            if (params['id']) {
                this.catId = params['id'];
                this.loadProductoscat(this.catId);
            } else {
                this.loadProductos();
            }
        });
    
    
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


  loadProductoscat(cat: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getByCat(cat).subscribe({
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

  filtrarcat(cat: string): void {
    this.loadProductoscat(cat);
  }

  navegar(id: string | undefined): void {

    this.router.navigate(['/catalogo', id]);
  }

  obtenerIcono(nombre: string): string {

  const n = nombre.toLowerCase();

  if (n.includes('figura')) {
    return '🗿';
  }

  if (n.includes('manga')) {
    return '📚';
  }

  if (n.includes('accesorio')) {
    return '🎒';
  }

  if (n.includes('ropa') || n.includes('camiseta')) {
    return '👕';
  }

  if (n.includes('carta') || n.includes('tcg')) {
    return '🃏';
  }

  if (n.includes('peluche')) {
    return '🧸';
  }

  return '📦';
}

buscar() {

  console.log(this.prod_nombre);
}


limpiarBusqueda() {
    this.prod_nombre = '';
}

cambiarCategoria(event: any) {

  const url = event.target.value;

  if (url) {

    window.location.href = url;
  }
}




abrirModal(producto: any) {

  openProductModal(
    producto.prod_id,
    producto.prod_nombre,
    producto.prod_descripcion || '',
    producto.prod_precio_venta,
    producto.prod_stock || 0,
    producto.cat?.cat_nombre || '',
    producto.prod_imagen ||
    producto.prod_imagen_url ||
    'assets/placeholders/generic_1.png'
  );
}


agregarAlPedido(producto: any) {

  addToCart(
    producto.prod_nombre,
    producto.prod_precio_venta,
    producto.prod_id,
    producto.prod_stock
  );
}


cerrarModal() {

  closeProductModal();
}



//   ejecutar(nombre: string, precio: number, id: string, stock: number){
//    (window as any).addToCart(nombre, precio, id, stock);
// }


}


declare function openProductModal(
  id: any,
  name: any,
  desc: any,
  price: any,
  stock: any,
  cat: any,
  img: any
): void;

declare function closeProductModal(): void;

declare function addToCart(
  nombre: any,
  precio: any,
  id: any,
  stock: any
): void;