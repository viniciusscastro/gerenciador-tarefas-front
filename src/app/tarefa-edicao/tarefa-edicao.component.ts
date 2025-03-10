import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
  dataTermino: string;
}

@Component({
  selector: 'app-tarefa-edicao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './tarefa-edicao.component.html',
  styleUrl: './tarefa-edicao.component.css'
})
export class TarefaEdicaoComponent implements OnInit {
  tarefaForm: FormGroup;
  tarefaId: number | null = null;
  carregando: boolean = true;
  erro: string | null = null;
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dataCriacao: [''],
      dataTermino: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.tarefaId = +params['id'];
        this.carregarTarefa(this.tarefaId);
      } else {
        this.erro = 'ID da tarefa não fornecido';
        this.carregando = false;
      }
    });
  }

  carregarTarefa(id: number): void {
    this.http.get<Tarefa>(`http://localhost:8080/api/tarefas/${id}`)
      .subscribe({
        next: (tarefa) => {
          this.tarefaForm.setValue({
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            dataCriacao: tarefa.dataCriacao,
            dataTermino: tarefa.dataTermino
          });
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar tarefa:', error);
          this.erro = 'Erro ao carregar tarefa. Verifique o console para mais detalhes.';
          this.carregando = false;
        }
      });
  }

  atualizarTarefa(): void {
    if (this.tarefaForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const tarefaAtualizada: Tarefa = {
      ...this.tarefaForm.value,
      id: this.tarefaId
    };

    this.http.put<Tarefa>(`http://localhost:8080/api/tarefas/${this.tarefaId}`, tarefaAtualizada)
      .subscribe({
        next: () => {
          alert('Tarefa atualizada com sucesso!');
          this.router.navigate(['/tarefas']);
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          alert('Erro ao atualizar tarefa. Verifique o console para mais detalhes.');
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/tarefas']);
  }
}