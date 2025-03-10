import { Routes } from '@angular/router';
import { TarefasListaComponent } from './tarefas-lista/tarefas-lista.component';
import { TarefaEdicaoComponent } from './tarefa-edicao/tarefa-edicao.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tarefas', pathMatch: 'full' },
  { path: 'tarefas', component: TarefasListaComponent },
  { path: 'editar-tarefa/:id', component: TarefaEdicaoComponent }
];