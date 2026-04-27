import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService, Board } from '../../../../core/services/board.service';
import { ListService } from '../../../../core/services/list.service';

@Component({
  selector: 'app-boards-list',
  imports: [FormsModule],
  templateUrl: './boards-list.html',
  styleUrl: './boards-list.css',
})
export class BoardsList {
  boards: Board[] = [];

  showModal = false;
  newBoardTitle = '';
  colors = [
    { label: 'Azul', value: 'bg-blue-500' },
    { label: 'Verde', value: 'bg-green-500' },
    { label: 'Roxo', value: 'bg-purple-500' },
    { label: 'Laranja', value: 'bg-orange-500' },
    { label: 'Vermelho', value: 'bg-red-500' },
    { label: 'Rosa', value: 'bg-pink-500' },
  ];
  selectedColor = 'bg-blue-500';

  constructor(
    private router: Router,
    private boardService: BoardService,
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {
    this.boards = this.boardService.getAll();
  }

  openBoard(id: string) {
    const board = this.boardService.getById(id);
    this.router.navigate(['/board', id], {
      state: { color: board?.color ?? 'bg-blue-500' },
    });
  }

  createBoard() {
    if (!this.newBoardTitle.trim()) return;
    this.boardService.create(this.newBoardTitle.trim(), this.selectedColor);
    this.boards = this.boardService.getAll();
    this.newBoardTitle = '';
    this.selectedColor = 'bg-blue-500';
    this.showModal = false;
    this.cdr.detectChanges();
  }

  deleteBoard(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.boardService.delete(id);
    this.listService.deleteLists(id);
    this.boards = this.boardService.getAll();
    this.cdr.detectChanges();
  }

  editingBoardId: string | null = null;
  editingBoardTitle = '';

  startEditBoard(event: MouseEvent, board: Board) {
    event.stopPropagation();
    this.editingBoardId = board.id;
    this.editingBoardTitle = board.title;
    this.cdr.detectChanges();
  }

  saveEditBoard(board: Board) {
    if (this.editingBoardTitle.trim()) {
      this.boardService.update(board.id, this.editingBoardTitle.trim());
      this.boards = this.boardService.getAll();
    }
    this.editingBoardId = null;
    this.cdr.detectChanges();
  }

  onEditBoardKeydown(event: KeyboardEvent, board: Board) {
    if (event.key === 'Enter') this.saveEditBoard(board);
    if (event.key === 'Escape') this.editingBoardId = null;
  }

  get totalLists(): number {
    return this.boards.reduce((acc, board) => {
      const lists = this.listService.getLists(board.id);
      return acc + lists.length;
    }, 0);
  }

  get totalCards(): number {
    return this.boards.reduce((acc, board) => {
      const lists = this.listService.getLists(board.id);
      return acc + lists.reduce((a, l) => a + l.cards.length, 0);
    }, 0);
  }
}
