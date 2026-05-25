import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegistroRequest } from '../../services/auth.service';
import { SexosService } from '../../services/sexos.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isLoading = false;
  isSexosLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  sexos: any[] = [];

  logoPath = 'icono_tienda.png';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sexosService: SexosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarSexos();

    // Si ya está autenticado, redirigir a home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  initForm(): void {
    this.registroForm = this.fb.group({
      id_usuario: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      primer_apellido: ['', [Validators.required, Validators.minLength(2)]],
      segundo_apellido: ['', []],
      fecha_nacimiento: ['', []],
      usuario_id_sexo: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  cargarSexos(): void {
    this.isSexosLoading = true;
    this.sexosService.getAll().subscribe({
      next: (data) => {
        this.sexos = data;
        this.isSexosLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar sexos:', error);
        this.isSexosLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registro: RegistroRequest = {
      id_usuario: this.registroForm.get('id_usuario')?.value,
      nombre: this.registroForm.get('nombre')?.value,
      primer_apellido: this.registroForm.get('primer_apellido')?.value,
      segundo_apellido: this.registroForm.get('segundo_apellido')?.value || '',
      fecha_nacimiento: this.registroForm.get('fecha_nacimiento')?.value || '',
      password: this.registroForm.get('password')?.value,
      usuario_id_sexo: parseInt(this.registroForm.get('usuario_id_sexo')?.value)
    };

    this.authService.registro(registro).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Registro exitoso. Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al registrarse';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
