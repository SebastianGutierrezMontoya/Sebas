import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultasDinamicasService } from '../../services/consultasdinamicas.service';

@Component({
  selector: 'app-consultas-dinamicas-resultado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas_dinamicas_resultado.html',
  styleUrls: ['./consultas_dinamicas_resultado.css']
})
export class ConsultasDinamicasResultado implements OnInit {
  sqlQuery: string = '';
  resultados: any[] = [];
  columnas: string[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private service: ConsultasDinamicasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si viene de una consulta guardada, cargar su SQL
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.service.getById(params['id']).subscribe({
          next: (consulta: any) => {
            this.sqlQuery = consulta.cons_sql;
            this.ejecutarConsulta();
          },
          error: (err) => {
            this.errorMessage = 'Error al cargar la consulta';
            console.error(err);
          }
        });
      }
    });
  }

  ejecutarConsulta(): void {
    if (!this.sqlQuery.trim()) {
      this.errorMessage = 'Ingresa una consulta SQL';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.resultados = [];
    this.columnas = [];

    this.service.ejecutarConsulta(this.sqlQuery).subscribe({
      next: (response: any) => {
        this.resultados = response.data || [];
        this.columnas = response.columns || [];
        this.successMessage = `Consulta ejecutada exitosamente. ${this.resultados.length} fila(s) retornada(s).`;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al ejecutar la consulta';
        this.isLoading = false;
      }
    });
  }

  limpiarResultados(): void {
    this.sqlQuery = '';
    this.resultados = [];
    this.columnas = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  volver(): void {
    this.router.navigate(['/consultas_dinamicas']);
  }

  exportarCSV(): void {
    if (this.resultados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear CSV
    let csv = this.columnas.join(',') + '\n';
    
    this.resultados.forEach(row => {
      const values = this.columnas.map(col => {
        const value = row[col];
        // Escapar comillas y envolver en comillas si contiene coma
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      });
      csv += values.join(',') + '\n';
    });

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consulta_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
