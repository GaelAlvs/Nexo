import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface Board {
  id: string;
  title: string;
  color: string;
}

const BOARDS_KEY = 'nexo_boards';

const DEFAULT_BOARDS: Board[] = [
  { id: '1', title: 'Projeto Frontend', color: 'bg-blue-500' },
  { id: '2', title: 'Marketing Q2', color: 'bg-green-500' },
  { id: '3', title: 'Design System', color: 'bg-purple-500' },
  { id: '4', title: 'Backlog Geral', color: 'bg-orange-500' },
];

@Injectable({ providedIn: 'root' })
export class BoardService {
  private boards: Board[] = [];

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Board[]>(BOARDS_KEY);
    this.boards = saved ?? DEFAULT_BOARDS;
  }

  private persist(): void {
    this.storage.set(BOARDS_KEY, this.boards);
  }

  getAll(): Board[] {
    return this.boards;
  }

  getById(id: string): Board | undefined {
    return this.boards.find((b) => b.id === id);
  }

  create(title: string, color: string): Board {
    const board: Board = { id: Date.now().toString(), title, color };
    this.boards.push(board);
    this.persist();
    return board;
  }

  delete(id: string): void {
    this.boards = this.boards.filter((b) => b.id !== id);
    this.persist();
  }

  update(id: string, title: string): void {
    const board = this.boards.find((b) => b.id === id);
    if (board) {
      board.title = title;
      this.persist();
    }
  }
}
