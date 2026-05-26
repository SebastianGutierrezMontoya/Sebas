import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { UsuariosService } from '../../services/usuarios.service';
import { ContactosService } from '../../services/contactos.service';
import { ConfigContactoService } from '../../services/configcontacto.service';
import { SexosService } from '../../services/sexos.service';
import { PerfilesService } from '../../services/perfiles.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {

  perfilform!: FormGroup;
  contrasenaform!: FormGroup;

  contactos(): FormArray {
    return this.perfilform.get('contactos') as FormArray;
  }

  sexos: any[] = [];
  perfiles: any[] = [];
  contactoID: any[] = [];
  contacto: any[] = [];
  configContacto: any[] = [];
  contactosCombinados: any[] = [];

  usuario: any = null;
  isAuthenticated = false;
  logoPath = 'icono_tienda.png';

  usuarioId: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  passwordLoading = false;
  passwordError = '';
  passwordSuccess = '';
  Usuarionombre: string = '';

  constructor(
    private fb: FormBuilder,
        private service: UsuariosService,
    private SexosService: SexosService,
    private PerfilesService: PerfilesService,
    private ContactosService: ContactosService,
    private ConfigContactoService: ConfigContactoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSexos();
    this.loadContactos();
    this.loadConfigContacto();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usuarioId = params['id'];
        
        // Esperar a que ambas peticiones se completen
        forkJoin({
          contactos: this.ContactosService.getByUsuarioId(this.usuarioId!),
          usuario: this.service.getById(this.usuarioId!)
        }).subscribe({
          next: (resultado) => {
            // Actualizar contactoID con los datos
            this.contactoID = resultado.contactos;
            // console.log('contactoID después de forkJoin:', this.contactoID);
            
            // Llenar el formulario con el usuario
            const userData = resultado.usuario;
            userData.fecha_nacimiento = userData.fecha_nacimiento ? userData.fecha_nacimiento.split('T')[0] : '';
            this.perfilform.patchValue(userData);
            this.Usuarionombre = userData.nombre;
            
            // Agregar contactos al formulario
            if (this.contactoID && this.contactoID.length > 0) {
              this.contactoID.forEach((contacto: any) => {
                this.contactos().push(
                  this.fb.group({
                    id_contacto: [contacto.id_contacto],
                    tipo_contacto: [contacto.tipo_contacto],
                    dato_contacto: [contacto.dato_contacto],
                    id_usuario: [this.usuarioId]
                  })
                );
              });
            }
            
            // Ahora sí puedes combinar datos con seguridad
            this.Combinar();
            
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error cargando datos:', err);
            this.errorMessage = 'Error al cargar los datos del usuario';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });

    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.isAuthenticated = !!usuario;
    });

    this.cdr.detectChanges();
  }

  private initForm(): void {
    this.perfilform = this.fb.group({
      // id_usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      fecha_nacimiento: ['', Validators.required],
      // password_hash: ['', Validators.required],
      usuario_id_sexo: ['', Validators.required],
      // usuario_id_perfil: ['', Validators.required],
      // activo: [true, Validators.required],
      contactos: this.fb.array([])
    });


    this.contrasenaform = this.fb.group({
      contraseña: ['', Validators.required],
      nueva_contraseña: ['', Validators.required],
      nueva_contraseña2: ['', Validators.required]

    })
  }

  private loadUsuario(): void {
    // Esta función ahora está integrada en ngOnInit con forkJoin
    // Se mantiene como referencia pero no se usa
  }

  loadContactosID(): void {
    // Esta función ahora está integrada en ngOnInit con forkJoin
    // Se mantiene como referencia pero no se usa
  }

  loadContactos(): void {
    this.ContactosService.getAll().subscribe({
      next: (data) => {
        this.contacto = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando contactos', err);
      }
    });
  }

  loadConfigContacto(): void {
    this.ConfigContactoService.getAll().subscribe({
      next: (data) => {
        this.configContacto = data; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando configContacto', err);
      }
    });

  }

  loadSexos(): void {
    this.SexosService.getAll().subscribe({
      next: (data) => {
        this.sexos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando sexos', err);
      }
    });
  }

  Combinar(): void {
    this.contactosCombinados = this.configContacto.map(config => {
          const contactoUsuario = this.contactoID.find(
            contacto => contacto.tipo_contacto === config.id_regla
        );
      
      return {
        ...config,
        dato_contacto: contactoUsuario?.dato_contacto || '',
        id_contacto: contactoUsuario?.id_contacto || null
      };
    });

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  guardarpw() {
    // Limpiar mensajes previos
    this.passwordError = '';
    this.passwordSuccess = '';

    const data = this.contrasenaform.value;

    // Validar que las contraseñas no estén vacías
    if (!data.contraseña || !data.nueva_contraseña || !data.nueva_contraseña2) {
      this.passwordError = 'Todos los campos son requeridos';
      return;
    }

    // Validar que la nueva contraseña tenga al menos 6 caracteres
    if (data.nueva_contraseña.length < 6) {
      this.passwordError = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    // Validar que las nuevas contraseñas coincidan
    if (data.nueva_contraseña !== data.nueva_contraseña2) {
      this.passwordError = 'Las contraseñas nuevas no coinciden';
      return;
    }

    // Validar que la nueva contraseña sea diferente a la antigua
    if (data.contraseña === data.nueva_contraseña) {
      this.passwordError = 'La nueva contraseña debe ser diferente a la actual';
      return;
    }

    this.passwordLoading = true;

    this.service.updatepass(this.usuario.id_usuario, data.contraseña, data.nueva_contraseña).subscribe({
      next: (response) => {
        this.passwordLoading = false;
        this.passwordSuccess = response.message || 'Contraseña actualizada exitosamente';
        
        // Limpiar el formulario
        this.contrasenaform.reset();
        
        // Limpiar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
          this.passwordSuccess = '';
        }, 5000);
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.passwordLoading = false;
        
        // Capturar el mensaje de error del backend
        if (err.error?.message) {
          this.passwordError = err.error.message;
        } else if (err.status === 401) {
          this.passwordError = 'Contraseña actual incorrecta';
        } else if (err.status === 404) {
          this.passwordError = 'Usuario no encontrado';
        } else if (err.status === 500) {
          this.passwordError = 'Error del servidor. Intenta más tarde';
        } else {
          this.passwordError = 'Error al cambiar la contraseña. Intenta de nuevo';
        }
        
        console.error('Error al cambiar contraseña:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
