import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
  dataTermino: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  tarefas: Tarefa[] = [];
  tarefaForm: FormGroup;
  termoPesquisa: string = '';
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dataTermino: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.http.get<Tarefa[]>('http://localhost:8080/api/tarefas')
      .subscribe({
        next: (data) => {
          this.tarefas = data;
        },
        error: (error) => {
          console.error('Erro ao carregar tarefas:', error);
          alert('Erro ao carregar tarefas. Verifique o console para mais detalhes.');
        }
      });
  }

  criarTarefa(): void {
    if (this.tarefaForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    
    const novaTarefa: Tarefa = {
      titulo: this.tarefaForm.value.titulo,
      descricao: this.tarefaForm.value.descricao,
      dataCriacao: dataFormatada,
      dataTermino: this.tarefaForm.value.dataTermino
    };

    this.http.post<Tarefa>('http://localhost:8080/api/tarefas', novaTarefa)
      .subscribe({
        next: (tarefa) => {
          this.tarefas.push(tarefa);
          this.tarefaForm.reset();
          alert('Tarefa criada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          alert('Erro ao criar tarefa. Verifique o console para mais detalhes.');
        }
      });
  }

  pesquisarTarefas(): void {
    if (!this.termoPesquisa.trim()) {
      this.carregarTarefas();
      return;
    }
    
    this.http.get<Tarefa[]>(`http://localhost:8080/api/tarefas/pesquisar?termo=${this.termoPesquisa}`)
      .subscribe({
        next: (data) => {
          this.tarefas = data;
        },
        error: (error) => {
          console.error('Erro ao pesquisar tarefas:', error);
          alert('Erro ao pesquisar tarefas. Verifique o console para mais detalhes.');
        }
      });
  }

  limparPesquisa(): void {
    this.termoPesquisa = '';
    this.carregarTarefas();
  }

  formatarData(data: string): string {
    if (!data) return '';
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
}