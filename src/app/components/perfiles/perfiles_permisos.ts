import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfilPermisosService } from '../../services/perfilpermisos.service';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModulosService } from '../../services/modulos.service';
import { PerfilesService } from '../../services/perfiles.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-perfiles-permisos',
  templateUrl: './perfiles_permisos.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class PerfilesPermisos implements OnInit {

    perfilId: number | null = null;
    perfilNombre: string = '';
    modulos: any[] = [];
    permisosPorModulo: Map<number, any> = new Map();
    isLoading = false;
    isSaving = false;
    errorMessage = '';
    successMessage = '';
    form!: FormGroup;

    constructor(
        private perfilPermisosService: PerfilPermisosService,
        private modulosService: ModulosService,
        private perfilesService: PerfilesService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();
        // Obtener el ID del perfil desde la ruta
        this.route.params.subscribe(params => {
            this.perfilId = params['id'];
            if (this.perfilId) {
                this.cargarDatos();
            }
        });
    }

    cargarDatos(): void {
        this.isLoading = true;
        
        // Cargar módulos, permisos actuales y datos del perfil en paralelo
        forkJoin([
            this.modulosService.getAll(),
            this.perfilPermisosService.getByPerfilId(this.perfilId!),
            this.perfilesService.getById(this.perfilId!)
        ]).subscribe({
            next: ([modulos, permisos, perfil]: [any[], any[], any]) => {
                this.modulos = modulos;
                this.perfilNombre = perfil.nombre || 'Perfil';
                
                // Crear un mapa de permisos existentes
                permisos.forEach(permiso => {
                    this.permisosPorModulo.set(permiso.mod_id, permiso);
                });
                
                // Inicializar permisos para módulos que no tienen
                this.modulos.forEach(modulo => {
                    if (!this.permisosPorModulo.has(modulo.id_mod)) {
                        this.permisosPorModulo.set(modulo.id_mod, {
                            perfil_id: this.perfilId,
                            mod_id: modulo.id_mod,
                            can_read: 'N',
                            can_create: 'N',
                            can_update: 'N',
                            can_delete: 'N'
                        });
                    }
                });
                
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.errorMessage = 'Error al cargar los datos: ' + (error?.message || 'Error desconocido');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // Obtener permisos de un módulo
    getPermiso(moduloId: number): any {
        return this.permisosPorModulo.get(moduloId) || {
            perfil_id: this.perfilId,
            mod_id: moduloId,
            can_read: 'N',
            can_create: 'N',
            can_update: 'N',
            can_delete: 'N'
        };
    }

    // Actualizar un permiso
    actualizarPermiso(moduloId: number, campo: string, valor: boolean): void {
        const permiso = this.getPermiso(moduloId);
        permiso[campo] = valor ? 'Y' : 'N';
        this.permisosPorModulo.set(moduloId, permiso);
    }

    // Guardar todos los permisos (upsert)
    guardarPermisos(): void {
        if (!this.perfilId) {
            this.errorMessage = 'Error: No se encontró el ID del perfil';
            return;
        }

        this.isSaving = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Convertir el mapa a array
        const permisos = Array.from(this.permisosPorModulo.values());

        this.perfilPermisosService.guardarPermisos(this.perfilId, permisos).subscribe({
            next: (response: any) => {
                this.successMessage = 'Permisos guardados exitosamente';
                this.isSaving = false;
                this.cdr.detectChanges();
                
                // Limpiar mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    this.successMessage = '';
                    this.cdr.detectChanges();
                }, 3000);
            },
            error: (error: any) => {
                this.errorMessage = 'Error al guardar los permisos: ' + (error?.error?.message || error?.message || 'Error desconocido');
                this.isSaving = false;
                this.cdr.detectChanges();
            }
        });
    }

    initForm(): void {
        this.form = this.fb.group({
            perfil_id: [null, Validators.required],
            mod_id: [null, Validators.required],
            can_create: ['N', Validators.required],
            can_read: ['N', Validators.required],
            can_update: ['N', Validators.required],
            can_delete: ['N', Validators.required],
        });
    }

    volver(): void {
        this.router.navigate(['/perfiles']);
    }
}