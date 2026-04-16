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
  roleId: string | null = null;

  idLoading = false;
  errorMessage = '';

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
      id_rol: ['', Validators.required],
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
            this.roleForm.patchValue(role);
          }
        });
      }
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
