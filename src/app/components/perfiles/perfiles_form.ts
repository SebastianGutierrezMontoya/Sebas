import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfilesService } from '../../services/perfiles.service';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { PerfilesPermisos } from './perfiles_permisos';
import { RolesService } from '../../services/roles.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-perfiles-form',
  templateUrl: './perfiles_form.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],


})

export class PerfilesForm implements OnInit {

    form!: FormGroup;

    roles: any[] = [];
    isEditMode = false;
    perfilId: number | null = null;
    isLoading = false;
    errorMessage = '';
    Perfilnombre = '';

    constructor(
        private perfilesService: PerfilesService,
        private rolesService: RolesService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) { }



    ngOnInit(): void {
        this.loadRoles();
        this.initForm();
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.isEditMode = true;
                this.perfilId = params['id'];
                this.loadPerfil();
            }
        });

    }

    loadRoles(): void {
        this.rolesService.getAll().subscribe((data: any[]) => {
            this.roles = data;
        });
    }

    initForm(): void {
        this.form = this.fb.group({
            id_perfil: [null, Validators.required],
            nombre: ['', Validators.required],
            descripcion: [''],
            rol_id: [null, Validators.required]
        });
    }

    loadPerfil(): void {
        if (this.perfilId) {
            this.isLoading = true;
            this.perfilesService.getById(this.perfilId).subscribe({
                next: (data) => {
                    this.Perfilnombre = data.nombre;
                    this.form.patchValue(data);
                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.errorMessage = 'Error al cargar el perfil';
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }

    Guardar(): void {
        if (this.form.invalid) {
            return;
        }

        const perfilData = this.form.value;

        if (this.isEditMode) {
            this.perfilesService.update(this.perfilId!, perfilData).subscribe({
                next: () => {
                    this.router.navigate(['/perfiles']);
                },
                error: (err) => {
                    this.errorMessage = 'Error al actualizar el perfil';
                }
            });
        } else {
            this.perfilesService.create(perfilData).subscribe({
                next: () => {
                    this.router.navigate(['/perfiles']);
                },
                error: (err) => {
                    this.errorMessage = 'Error al crear el perfil';
                }
            });
        }
    }

    volver(): void {
        this.router.navigate(['/perfiles']);
    }   
    
}