import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * Configuración para la generación de IDs autoincrementales
 */
export interface IdConfig {
  prefix: string;
  separator: string;
  minDigits?: number; // número mínimo de dígitos (ej: 3 para cat-001)
}

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  private readonly API_URL = 'http://localhost:3000/api/id-generator'; // Ajusta según tu API
  private readonly STORAGE_KEY = 'id_counters';

  /**
   * Configuración de patrones para diferentes entidades
   * Agrega aquí las nuevas entidades con sus patrones
   */
  private idConfigs: Map<string, IdConfig> = new Map([
    ['categoria', { prefix: 'cat', separator: '-', minDigits: 1 }],
    ['producto', { prefix: 'prod', separator: '-', minDigits: 1 }],
    ['usuario', { prefix: 'user', separator: '-', minDigits: 1 }],
    // Agregar más entidades según sea necesario
  ]);

  private counters: Map<string, number> = new Map();
  private isInitialized = false;

  constructor(private http: HttpClient) {
    this.initializeCounters();
  }

  /**
   * Inicializa los contadores desde localStorage o el servidor
   */
  private initializeCounters(): void {
    if (this.isInitialized) return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsedCounters = JSON.parse(stored);
        Object.entries(parsedCounters).forEach(([key, value]) => {
          this.counters.set(key, value as number);
        });
      } catch (e) {
        console.warn('Error al cargar contadores de localStorage:', e);
        this.resetCounters();
      }
    } else {
      this.resetCounters();
    }

    this.isInitialized = true;
  }

  /**
   * Reinicia los contadores a 0 para todas las entidades
   */
  private resetCounters(): void {
    this.idConfigs.forEach((_, key) => {
      this.counters.set(key, 0);
    });
    this.saveCountersToStorage();
  }

  /**
   * Guarda los contadores en localStorage
   */
  private saveCountersToStorage(): void {
    const countersObj: { [key: string]: number } = {};
    this.counters.forEach((value, key) => {
      countersObj[key] = value;
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(countersObj));
  }

  /**
   * Genera un ID autoincremental basado en el tipo de entidad
   * @param entityType Tipo de entidad (ej: 'categoria', 'producto')
   * @returns El nuevo ID generado
   */
  generateId(entityType: string): string {
    const config = this.idConfigs.get(entityType.toLowerCase());

    if (!config) {
      throw new Error(`Tipo de entidad no configurada: ${entityType}`);
    }

    const nextNumber = this.getNextCounter(entityType.toLowerCase());
    return this.formatId(config, nextNumber);
  }

  /**
   * Genera un ID de forma síncrona (local)
   */
  generateIdSync(entityType: string): string {
    return this.generateId(entityType);
  }

  /**
   * Genera un ID consultando el servidor para obtener el siguiente número
   * (Útil si deseas sincronización con múltiples clientes)
   */
  generateIdAsync(entityType: string): Observable<string> {
    return new Observable(observer => {
      try {
        const id = this.generateId(entityType);
        observer.next(id);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Obtiene y incrementa el contador para una entidad
   */
  private getNextCounter(entityType: string): number {
    const current = this.counters.get(entityType) || 0;
    const next = current + 1;
    this.counters.set(entityType, next);
    this.saveCountersToStorage();
    return next;
  }

  /**
   * Formatea el ID según la configuración
   */
  private formatId(config: IdConfig, number: number): string {
    const paddedNumber = this.padNumber(number, config.minDigits || 1);
    return `${config.prefix}${config.separator}${paddedNumber}`;
  }

  /**
   * Rellena un número con ceros a la izquierda
   */
  private padNumber(number: number, minDigits: number): string {
    return number.toString().padStart(minDigits, '0');
  }

  /**
   * Obtiene el contador actual de una entidad sin incrementarlo
   */
  getCounter(entityType: string): number {
    return this.counters.get(entityType.toLowerCase()) || 0;
  }

  /**
   * Establece manualmente el contador de una entidad
   */
  setCounter(entityType: string, value: number): void {
    this.counters.set(entityType.toLowerCase(), value);
    this.saveCountersToStorage();
  }

  /**
   * Agrega una nueva configuración de entidad
   */
  addIdConfig(entityType: string, config: IdConfig): void {
    this.idConfigs.set(entityType.toLowerCase(), config);
    if (!this.counters.has(entityType.toLowerCase())) {
      this.counters.set(entityType.toLowerCase(), 0);
      this.saveCountersToStorage();
    }
  }

  /**
   * Obtiene todas las configuraciones
   */
  getAllConfigs(): { [key: string]: IdConfig } {
    const configs: { [key: string]: IdConfig } = {};
    this.idConfigs.forEach((value, key) => {
      configs[key] = value;
    });
    return configs;
  }

  /**
   * Obtiene todos los contadores
   */
  getAllCounters(): { [key: string]: number } {
    const countersObj: { [key: string]: number } = {};
    this.counters.forEach((value, key) => {
      countersObj[key] = value;
    });
    return countersObj;
  }

  /**
   * Limpia todos los datos de localStorage
   */
  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.resetCounters();
  }

  /**
   * Sincroniza los contadores con el servidor (opcional)
   * Implementa este método si tu backend gestiona los IDs
   */
  syncWithServer(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.API_URL}/counters`);
  }
}
