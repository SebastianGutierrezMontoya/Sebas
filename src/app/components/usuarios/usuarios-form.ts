import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FormArray } from '@angular/forms';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ContactosService } from '../../services/contactos.service';
import { ConfigContactoService } from '../../services/configcontacto.service';
import { SexosService } from '../../services/sexos.service';
import { PerfilesService } from '../../services/perfiles.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios_form.html',
})




export class UsuariosForm implements OnInit {

  form!: FormGroup;

  contactos(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  sexos: any[] = [];
  perfiles: any[] = [];
  contactoID: any[] = [];
  contacto: any[] = [];
  configContacto: any[] = [];

  isEditMode = false;
  usuarioId: string | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSexos();
    this.loadPerfiles();
    this.loadContactos();
    this.loadConfigContacto();
    // console.log(this.contacto);
    // console.log(this.contactos());
    // console.log(this.sexos);
    // console.log(this.perfiles);
    // console.log(this.configContacto);

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.usuarioId = params['id'];
        this.loadContactosID();
        this.loadUsuario();
        
        // console.log(this.contactoID);
        // Aquí podrías cargar los datos del usuario para editar
      }
    });
  }
      
  // ngOnInit(): void {
  //   this.form = this.fb.group({
  //     id_usuario: ['', Validators.required],
  //     nombre: ['', Validators.required],
  //     primer_apellido: ['', Validators.required],
  //     segundo_apellido: [''],
  //     fecha_nacimiento: ['', Validators.required],
  //     password_hash: ['', Validators.required],
  //     usuario_id_sexo: ['', Validators.required],
  //     usuario_id_perfil: ['', Validators.required],
  //     activo: [true, Validators.required],
  //     contactos: this.fb.array([])
  //   });

  // }

  constructor(
    private fb: FormBuilder,
    private service: UsuariosService,
    private SexosService: SexosService,
    private PerfilesService: PerfilesService,
    private ContactosService: ContactosService,
    private ConfigContactoService: ConfigContactoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id_usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      fecha_nacimiento: ['', Validators.required],
      password_hash: ['', Validators.required],
      usuario_id_sexo: ['', Validators.required],
      usuario_id_perfil: ['', Validators.required],
      activo: [true, Validators.required],
      contactos: this.fb.array([])
    });
  }

  private loadUsuario(): void {
    if (!this.usuarioId) return;
    this.isLoading = true;

    this.service.getById(this.usuarioId).subscribe({
      next: (data) => {
        data.fecha_nacimiento = data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : '';
        this.form.patchValue(data);
        if (this.contactoID) {
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
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar usuario';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  // AGREGAR CONTACTO
  agregarContacto() {
    this.contactos().push(
      this.fb.group({
        id_contacto: [0],
        tipo_contacto: [''],
        dato_contacto: [''],
        id_usuario: [this.usuarioId || '']
      })
    );
  }

  // ELIMINAR CONTACTO
  eliminarContacto(index: number) {
    this.contactos().removeAt(index);
  }

  guardar() {
    const data = this.form.value;
    console.log('Datos a guardar:', data);
    const contactosData = data.contactos;
    console.log('Contactos a guardar:', contactosData);
    delete data.contactos; // Eliminar la propiedad contactos del objeto data
    
    if (this.isEditMode && this.usuarioId) {
      
    
        this.service.update(this.usuarioId, data).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });


        contactosData.forEach((contacto: any) => {
          if (contacto.id_contacto && contacto.id_contacto !== 0) {
            // Verificar si el contacto existe en contactoID
            const existe = this.contactoID.some(c => c.id_contacto === contacto.id_contacto);
            if (existe) {
              this.ContactosService.update(contacto.id_contacto, contacto).subscribe();
            }
          } else {
            this.ContactosService.create(contacto).subscribe();
          }
        });
      

    } else {
      this.service.create(data).subscribe((usuarioCreado) => {
        data.id_usuario = usuarioCreado.id_usuario;
        contactosData.forEach((contacto: any) => {
          contacto.id_usuario = data.id_usuario;
          this.ContactosService.create(contacto).subscribe();
        });
        this.router.navigate(['/usuarios']);
      });
    }

  }

  volver() {
    this.router.navigate(['/usuarios']);
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

  loadPerfiles(): void {
    this.PerfilesService.getAll().subscribe({
      next: (data) => {
        this.perfiles = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando perfiles', err);
      }
    });
  }

  loadContactosID(): void {
    this.ContactosService.getByUsuarioId(this.usuarioId!).subscribe({
      next: (data) => {
        this.contactoID = data;


        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando contactos', err);
      }
    });
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

  
}