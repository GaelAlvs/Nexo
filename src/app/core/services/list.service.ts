import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface Label {
  id: string;
  text: string;
  color: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: Label[];
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

const DEFAULT_LISTS: List[] = [
  {
    id: 'list-1',
    title: 'A fazer',
    cards: [
      { id: 'card-1', title: 'Criar tela de login', description: '', labels: [] },
      { id: 'card-2', title: 'Configurar rotas', description: '', labels: [] },
      { id: 'card-3', title: 'Instalar dependências', description: '', labels: [] },
    ],
  },
  {
    id: 'list-2',
    title: 'Em progresso',
    cards: [
      { id: 'card-4', title: 'Desenvolver board detail', description: '', labels: [] },
      { id: 'card-5', title: 'Implementar drag and drop', description: '', labels: [] },
    ],
  },
  {
    id: 'list-3',
    title: 'Concluído',
    cards: [
      { id: 'card-6', title: 'Setup do projeto', description: '', labels: [] },
      { id: 'card-7', title: 'Configurar Tailwind', description: '', labels: [] },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ListService {
  private key(boardId: string): string {
    return `nexo_lists_${boardId}`;
  }

  constructor(private storage: StorageService) {}

  getLists(boardId: string): List[] {
    const saved = this.storage.get<List[]>(this.key(boardId));
    // apenas o board '1' tem dados padrão
    return saved ?? (boardId === '1' ? DEFAULT_LISTS : []);
  }

  saveLists(boardId: string, lists: List[]): void {
    this.storage.set(this.key(boardId), lists);
  }

  deleteLists(boardId: string): void {
    this.storage.remove(this.key(boardId));
  }
}
