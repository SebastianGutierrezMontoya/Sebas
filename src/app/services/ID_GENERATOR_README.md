# ID Generator Service

Servicio Angular para generar IDs autoincrementales con patrones personalizados. Ideal para tablas que requieren IDs tipo string con prefijos específicos.

## Características

✅ Generación automática de IDs autoincrementales  
✅ Patrones personalizables por entidad  
✅ Persistencia en localStorage  
✅ Múltiples formatos (cat-1, prod-001, etc.)  
✅ Fácil de extender y personalizar  

## Instalación

El servicio ya está creado en `src/app/services/id-generator.service.ts`

## Patrones Predefinidos

| Entidad | Prefijo | Patrón | Ejemplo |
|---------|---------|--------|---------|
| Categorías | `cat` | cat-N | cat-1, cat-2, cat-3 |
| Productos | `prod` | prod-N | prod-1, prod-2, prod-3 |
| Usuarios | `user` | user-N | user-1, user-2, user-3 |

## Uso Básico

### 1. Inyectar el servicio en tu componente

```typescript
import { Component } from '@angular/core';
import { IdGeneratorService } from '../services/id-generator.service';

@Component({
  selector: 'app-categorias-form',
  templateUrl: './categorias-form.html'
})
export class CategoriasFormComponent {
  constructor(private idGeneratorService: IdGeneratorService) {}
}
```

### 2. Generar un ID

```typescript
// Generación síncrona (recomendada)
const nuevoId = this.idGeneratorService.generateId('categoria');
console.log(nuevoId); // Output: cat-1
```

### 3. Usar en un formulario

```typescript
guardarCategoria() {
  const categoria = {
    cat_id: this.idGeneratorService.generateId('categoria'),
    cat_nombre: this.formulario.value.nombre,
    cat_descripcion: this.formulario.value.descripcion
  };

  this.categoriaService.create(categoria).subscribe({
    next: (resultado) => console.log('Categoría creada:', resultado),
    error: (err) => console.error('Error:', err)
  });
}
```

## Métodos Disponibles

### `generateId(entityType: string): string`
Genera un nuevo ID autoincremental para la entidad especificada.

```typescript
const id = this.idGeneratorService.generateId('categoria');
// Retorna: cat-1, cat-2, cat-3, ...
```

### `generateIdSync(entityType: string): string`
Alias para `generateId()` - generación síncrona.

```typescript
const id = this.idGeneratorService.generateIdSync('producto');
// Retorna: prod-1, prod-2, prod-3, ...
```

### `generateIdAsync(entityType: string): Observable<string>`
Versión Observable (si lo necesitas para flujos reactivos).

```typescript
this.idGeneratorService.generateIdAsync('usuario').subscribe(
  id => console.log('ID generado:', id)
);
```

### `getCounter(entityType: string): number`
Obtiene el contador actual sin incrementarlo.

```typescript
const contador = this.idGeneratorService.getCounter('categoria');
console.log('Próximo ID será:', contador + 1);
```

### `setCounter(entityType: string, value: number): void`
Establece manualmente el contador de una entidad.

```typescript
this.idGeneratorService.setCounter('categoria', 100);
// El próximo ID será cat-101
```

### `addIdConfig(entityType: string, config: IdConfig): void`
Agrega una nueva configuración de entidad.

```typescript
this.idGeneratorService.addIdConfig('estado', {
  prefix: 'est',
  separator: '-',
  minDigits: 2  // est-01, est-02, ...
});
```

### `getAllConfigs(): { [key: string]: IdConfig }`
Obtiene todas las configuraciones de entidades.

```typescript
const configs = this.idGeneratorService.getAllConfigs();
console.log(configs);
```

### `getAllCounters(): { [key: string]: number }`
Obtiene todos los contadores actuales.

```typescript
const contadores = this.idGeneratorService.getAllCounters();
console.log(contadores); // { categoria: 5, producto: 12, usuario: 3 }
```

### `clearStorage(): void`
Reinicia todos los contadores a 0.

```typescript
this.idGeneratorService.clearStorage();
```

## Configurar Nuevas Entidades

Agrégalas en el `app.component.ts` o en un servicio de inicialización:

```typescript
ngOnInit(): void {
  // Categorías con minDigits: 1 → cat-1, cat-2, ...
  this.idGeneratorService.addIdConfig('categoria', {
    prefix: 'cat',
    separator: '-',
    minDigits: 1
  });

  // Usuarios con minDigits: 3 → user-001, user-002, ...
  this.idGeneratorService.addIdConfig('usuario', {
    prefix: 'user',
    separator: '-',
    minDigits: 3
  });

  // Productos con guion bajo → prod_1, prod_2, ...
  this.idGeneratorService.addIdConfig('producto', {
    prefix: 'prod',
    separator: '_',
    minDigits: 1
  });
}
```

## Patrones Personalizados

### Patrón con 3 dígitos (est-001)

```typescript
this.idGeneratorService.addIdConfig('estado', {
  prefix: 'est',
  separator: '-',
  minDigits: 3
});

const id = this.idGeneratorService.generateId('estado');
// Retorna: est-001, est-002, est-003, ...
```

### Patrón con prefijo y año

```typescript
generarIdConAño(entityType: string): string {
  const año = new Date().getFullYear();
  const id = this.idGeneratorService.generateId(entityType);
  return id.replace('-', `-${año}-`);
}

const id = this.generarIdConAño('producto');
// Retorna: prod-2026-1, prod-2026-2, ...
```

### Patrón con separador diferente

```typescript
this.idGeneratorService.addIdConfig('sexo', {
  prefix: 'sex',
  separator: '_',  // O: '-', '.', etc.
  minDigits: 2
});

const id = this.idGeneratorService.generateId('sexo');
// Retorna: sex_01, sex_02, sex_03, ...
```

## Integración con Servicios CRUD

Actualiza tus servicios para usar automáticamente el generador:

```typescript
@Injectable({ providedIn: 'root' })
export class CategoriaService extends BaseService<Categoria, string> {
  constructor(
    http: HttpClient,
    private idGenerator: IdGeneratorService
  ) {
    super(http, 'http://localhost:3000/api/categorias');
  }

  crearCategoria(nombre: string, descripcion?: string): Observable<Categoria> {
    const categoria: Categoria = {
      cat_id: this.idGenerator.generateId('categoria'),
      cat_nombre: nombre,
      cat_descripcion: descripcion
    };
    return this.create(categoria);
  }
}
```

## Persistencia

El servicio almacena los contadores en **localStorage**:

```
Clave: "id_counters"
Valor: { "categoria": 5, "producto": 12, "usuario": 3 }
```

Los contadores persisten entre sesiones del navegador. Para limpiarlos:

```typescript
this.idGeneratorService.clearStorage();
```

## Casos de Uso Recomendados

### ✅ Usar generador local cuando:
- Los IDs se generan solo desde el cliente
- No hay sincronización entre múltiples usuarios
- Los contadores son locales por usuario

### ⚠️ Considerar backend cuando:
- Múltiples usuarios crean registros simultáneamente
- Necesitas garantizar unicidad global
- Los contadores deben ser compartidos entre clientes

Para sincronización con servidor, usa:

```typescript
this.idGeneratorService.syncWithServer().subscribe(
  counters => console.log('Contadores sincronizados:', counters)
);
```

## Ejemplos Completos

Vea el archivo `ID_GENERATOR_EXAMPLES.ts` para más ejemplos de uso.

## Problemas Comunes

**P: El contador se reinicia después de recargar la página**  
R: Los datos están en localStorage. Verifica que el navegador no tenga localStorage deshabilitado.

**P: ¿Qué pasa si dos usuarios generan IDs simultáneamente?**  
R: Con el cliente local, puede haber colisiones. Implementa validación en el backend o usa sincronización del servidor.

**P: ¿Puedo cambiar el patrón después de haber generado IDs?**  
R: No es recomendable. Los contadores ya existen. Si lo haces, los nuevos IDs seguirán el nuevo patrón pero con el contador anterior.

## Configuración Recomendada

Agrega esto a tu `app.config.ts` o `app.component.ts`:

```typescript
constructor(private idGenerator: IdGeneratorService) {
  // Configurar todas las entidades que uses
  this.idGenerator.addIdConfig('categoria', {
    prefix: 'cat',
    separator: '-',
    minDigits: 1
  });

  this.idGenerator.addIdConfig('producto', {
    prefix: 'prod',
    separator: '-',
    minDigits: 1
  });

  // ... más entidades
}
```

## Licencia

Este servicio es parte del proyecto Angular.
