/**
 * GUÍA DE USO - ID Generator Service
 * 
 * Este archivo contiene ejemplos de cómo usar el IdGeneratorService
 * en tus componentes y servicios.
 */

// ============================================
// EJEMPLO 1: Uso básico en un componente
// ============================================

// import { Component, OnInit } from '@angular/core';
// import { IdGeneratorService } from '../services/id-generator.service';

// @Component({
//   selector: 'app-categorias-form',
//   templateUrl: './categorias-form.html',
//   styleUrls: ['./categorias-form.css']
// })
// export class CategoriasFormComponent implements OnInit {
//   nuevaCategoria = {
//     cat_id: '',
//     cat_nombre: '',
//     cat_descripcion: ''
//   };

//   constructor(private idGeneratorService: IdGeneratorService) {}

//   ngOnInit(): void {
//     // Generar un nuevo ID automáticamente al abrir el formulario
//     this.generarNuevoId();
//   }

//   generarNuevoId(): void {
//     this.nuevaCategoria.cat_id = this.idGeneratorService.generateId('categoria');
//     console.log('Nuevo ID generado:', this.nuevaCategoria.cat_id);
//   }

//   guardar(): void {
//     if (!this.nuevaCategoria.cat_id) {
//       this.nuevaCategoria.cat_id = this.idGeneratorService.generateId('categoria');
//     }
//     // Enviar a tu servicio...
//   }
// }

// // ============================================
// // EJEMPLO 2: Uso en un servicio
// // ============================================

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BaseService } from './base.service';
// import { Categoria } from '../models/models';
// import { IdGeneratorService } from './id-generator.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class CategoriaService extends BaseService<Categoria, string> {

//   constructor(
//     http: HttpClient,
//     private idGeneratorService: IdGeneratorService
//   ) {
//     super(http, 'http://localhost:3000/api/categorias');
//   }

//   crearCategoria(nombre: string, descripcion?: string): void {
//     const nuevaCategoria: Categoria = {
//       cat_id: this.idGeneratorService.generateId('categoria'),
//       cat_nombre: nombre,
//       cat_descripcion: descripcion
//     };

//     this.create(nuevaCategoria).subscribe({
//       next: (resultado) => {
//         console.log('Categoría creada:', resultado);
//       },
//       error: (error) => {
//         console.error('Error al crear categoría:', error);
//       }
//     });
//   }
// }

// // ============================================
// // EJEMPLO 3: Configurar nuevas entidades
// // ============================================

// export class AppComponent implements OnInit {
//   constructor(private idGeneratorService: IdGeneratorService) {}

//   ngOnInit(): void {
//     // Agregar configuración para nuevas entidades
//     this.idGeneratorService.addIdConfig('estado', {
//       prefix: 'est',
//       separator: '-',
//       minDigits: 2  // est-01, est-02, etc.
//     });

//     this.idGeneratorService.addIdConfig('sexo', {
//       prefix: 'sex',
//       separator: '-',
//       minDigits: 3  // sex-001, sex-002, etc.
//     });
//   }
// }

// // ============================================
// // EJEMPLO 4: Obtener información de contadores
// // ============================================

// export class AdminComponent {
//   constructor(private idGeneratorService: IdGeneratorService) {}

//   verContadores(): void {
//     const contadores = this.idGeneratorService.getAllCounters();
//     console.log('Contadores actuales:', contadores);
//     // Resultado: { categoria: 5, producto: 12, usuario: 23, ... }
//   }

//   verConfiguraciones(): void {
//     const configs = this.idGeneratorService.getAllConfigs();
//     console.log('Configuraciones:', configs);
//   }

//   resetearTodo(): void {
//     this.idGeneratorService.clearStorage();
//     console.log('Todos los contadores han sido reiniciados');
//   }
// }

// // ============================================
// // EJEMPLO 5: Uso con Observable (Async)
// // ============================================

// export class ProductoComponent {
//   constructor(private idGeneratorService: IdGeneratorService) {}

//   crearProductoAsync(): void {
//     this.idGeneratorService.generateIdAsync('producto').subscribe({
//       next: (id) => {
//         console.log('Nuevo ID de producto:', id);
//         // Usar el ID generado
//       },
//       error: (err) => {
//         console.error('Error al generar ID:', err);
//       }
//     });
//   }
// }

// // ============================================
// // PATRONES PERSONALIZADOS
// // ============================================

// /**
//  * Si necesitas patrones más complejos, puedes personalizar:
//  * 
//  * Ejemplo: Categorías con prefijo y año
//  * - cat-2024-001
//  * - cat-2024-002
//  * 
//  * Ejemplo: Usuarios con región
//  * - user-mx-001
//  * - user-ar-002
//  * 
//  * Para esto, extiende el servicio o agrega métodos adicionales:
//  */

// export class CustomIdGeneratorService extends IdGeneratorService {
  
//   generarIdConAño(entityType: string): string {
//     const año = new Date().getFullYear();
//     const baseId = this.generateId(entityType);
//     // Insertar año en el formato deseado
//     return baseId.replace('-', `-${año}-`);
//   }

//   generarIdConRegion(entityType: string, region: string): string {
//     const baseId = this.generateId(entityType);
//     return baseId.replace('-', `-${region}-`);
//   }
// }

// // ============================================
// // CONFIGURACIONES RECOMENDADAS
// // ============================================

// /**
//  * PARA DIFERENTES ENTIDADES:
//  * 
//  * Categorías:
//  * - Prefijo: 'cat'
//  * - Patrón: cat-1, cat-2, cat-3
//  * - Config: { prefix: 'cat', separator: '-', minDigits: 1 }
//  * 
//  * Productos:
//  * - Prefijo: 'prod'
//  * - Patrón: prod-1, prod-2, prod-3
//  * - Config: { prefix: 'prod', separator: '-', minDigits: 1 }
//  * 
//  * Usuarios:
//  * - Prefijo: 'user'
//  * - Patrón: user-001, user-002, user-003
//  * - Config: { prefix: 'user', separator: '-', minDigits: 3 }
//  * 
//  * Estados:
//  * - Prefijo: 'est'
//  * - Patrón: est-01, est-02, est-03
//  * - Config: { prefix: 'est', separator: '-', minDigits: 2 }
//  * 
//  * Sexos:
//  * - Prefijo: 'sex'
//  * - Patrón: sex-01, sex-02, sex-03
//  * - Config: { prefix: 'sex', separator: '-', minDigits: 2 }
//  */
