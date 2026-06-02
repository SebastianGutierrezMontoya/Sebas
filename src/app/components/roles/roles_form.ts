import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './roles_form.html',
})
export class RolesForm implements OnInit {

  roleForm!: FormGroup;

  roles: any[] = [];

  isEditMode = false;
  roleId: number | null = null;
  Rolnombre: string = '';

  idLoading = false;
  errorMessage = '';

  nextId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.roleForm = this.formBuilder.group({
      id_rol: [null],
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.rolesService.getById(id).subscribe({
          next: (role) => {
            this.Rolnombre = role.nombre;
            this.isEditMode = true;
            this.roleForm.patchValue(role);
          }
        });
      } else {
        this.loadid();
      }
    });
  }


  async loadid(): Promise<void> {
    this.obtenerProximoId().then(id => {
      this.nextId = id;
    });

  }


  private obtenerProximoId(): Promise<number> {
    return new Promise((resolve) => {
      this.rolesService.getAll().subscribe({
        next: (roles: any[]) => {
          if (!roles || roles.length === 0) {
            resolve(1);
          } else {
            const maxId = Math.max(...roles.map(r => r.id_rol || 0));
            resolve(maxId + 1);
          }
        },
        error: () => {
          // Si hay error, retorna 1
          resolve(1);
        }
      });
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.value;
      this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.rolesService.update(id, roleData).subscribe({
            next: () => {
              this.router.navigate(['/roles']);
            }
          });
        } else {
          roleData.id_rol = this.nextId;
          this.rolesService.create(roleData).subscribe({
            next: () => {
              this.router.navigate(['/roles']);
            }
          });
        }
      });
    }
  }

}
