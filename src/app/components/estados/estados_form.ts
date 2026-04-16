import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, } from '@angular/router';
import { EstadoPedidosService } from '../../services/estadopedidos.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-estados_form',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './estados_form.html',
})
export class EstadosForm implements OnInit {

  form!: FormGroup;

  isEditMode = false;
  estadoId: number | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: EstadoPedidosService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.estadoId = params['id'];
        this.loadEstado();
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      est_id: ['', Validators.required],
      est_nombre: ['', Validators.required],
    });
  }

  loadEstado(): void {
    if (!this.estadoId) return;
    this.isLoading = true;
    this.service.getById(this.estadoId).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Estado cargado:', data);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar el estado';  
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveEstado(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const estadoData = this.form.value;
    if (this.isEditMode && this.estadoId) {
      this.service.update(this.estadoId, estadoData).subscribe({
        next: () => {
          this.router.navigate(['/estado_pedidos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al actualizar el estado';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.service.create(estadoData).subscribe({
        next: () => {
          this.router.navigate(['/estado_pedidos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al crear el estado';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }



}
