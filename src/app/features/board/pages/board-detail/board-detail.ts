import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BoardService } from '../../../../core/services/board.service';
import { ListService, List, Card, Label } from '../../../../core/services/list.service';

@Component({
  selector: 'app-board-detail',
  imports: [FormsModule, DragDropModule, RouterLink],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit {
  boardTitle = '';
  boardColor = 'bg-blue-700';
  boardId = '';

  lists: List[] = [];

  showAddList = false;
  newListTitle = '';
  activeAddCardListId: string | null = null;
  newCardTitle = '';

  selectedCard: Card | null = null;
  selectedListId: string | null = null;
  showCardModal = false;

  availableLabels: Label[] = [
    { id: 'l1', text: 'Bug', color: 'bg-red-500' },
    { id: 'l2', text: 'Feature', color: 'bg-blue-500' },
    { id: 'l3', text: 'Urgente', color: 'bg-orange-500' },
    { id: 'l4', text: 'Melhoria', color: 'bg-green-500' },
    { id: 'l5', text: 'Design', color: 'bg-purple-500' },
    { id: 'l6', text: 'Revisão', color: 'bg-yellow-500' },
  ];

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.boardId = id;
      const board = this.boardService.getById(id);
      this.boardTitle = board ? board.title : 'Quadro';
      this.boardColor = board?.color ?? 'bg-blue-700';
      this.lists = this.listService.getLists(id);
    }
  }

  private save(): void {
    this.listService.saveLists(this.boardId, this.lists);
  }

  get listIds(): string[] {
    return this.lists.map((l) => l.id);
  }

  dropCard(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.save();
    this.cdr.detectChanges();
  }

  dropList(event: CdkDragDrop<List[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.save();
    this.cdr.detectChanges();
  }

  addList() {
    if (!this.newListTitle.trim()) return;
    this.lists.push({ id: 'list-' + Date.now(), title: this.newListTitle.trim(), cards: [] });
    this.newListTitle = '';
    this.showAddList = false;
    this.save();
    this.cdr.detectChanges();
  }

  deleteList(listId: string) {
    this.lists = this.lists.filter((l) => l.id !== listId);
    this.save();
    this.cdr.detectChanges();
  }

  addCard(listId: string) {
    if (!this.newCardTitle.trim()) return;
    const list = this.lists.find((l) => l.id === listId);
    if (!list) return;
    list.cards.push({
      id: 'card-' + Date.now(),
      title: this.newCardTitle.trim(),
      description: '',
      labels: [],
    });
    this.newCardTitle = '';
    this.activeAddCardListId = null;
    this.save();
    this.cdr.detectChanges();
  }

  cancelAddCard() {
    this.newCardTitle = '';
    this.activeAddCardListId = null;
    this.cdr.detectChanges();
  }

  deleteCard(listId: string, cardId: string) {
    const list = this.lists.find((l) => l.id === listId);
    if (!list) return;
    list.cards = list.cards.filter((c) => c.id !== cardId);
    this.save();
    this.cdr.detectChanges();
  }

  openCardModal(card: Card, listId: string) {
    this.selectedCard = { ...card, labels: [...card.labels] };
    this.selectedListId = listId;
    this.showCardModal = true;
    this.cdr.detectChanges();
  }

  closeCardModal() {
    this.showCardModal = false;
    this.selectedCard = null;
    this.selectedListId = null;
    this.cdr.detectChanges();
  }

  saveCard() {
    if (!this.selectedCard || !this.selectedListId) return;
    const list = this.lists.find((l) => l.id === this.selectedListId);
    if (!list) return;
    const index = list.cards.findIndex((c) => c.id === this.selectedCard!.id);
    if (index !== -1) {
      list.cards[index] = { ...this.selectedCard };
    }
    this.save();
    this.closeCardModal();
    this.cdr.detectChanges();
  }

  hasLabel(labelId: string): boolean {
    return this.selectedCard?.labels.some((l) => l.id === labelId) ?? false;
  }

  toggleLabel(label: Label) {
    if (!this.selectedCard) return;
    const index = this.selectedCard.labels.findIndex((l) => l.id === label.id);
    if (index === -1) {
      this.selectedCard.labels.push(label);
    } else {
      this.selectedCard.labels.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  // Edição inline de lista
  editingListId: string | null = null;
  editingListTitle = '';

  startEditList(list: List) {
    this.editingListId = list.id;
    this.editingListTitle = list.title;
    this.cdr.detectChanges();
  }

  saveEditList(list: List) {
    if (this.editingListTitle.trim()) {
      list.title = this.editingListTitle.trim();
      this.save();
    }
    this.editingListId = null;
    this.cdr.detectChanges();
  }

  onEditListKeydown(event: KeyboardEvent, list: List) {
    if (event.key === 'Enter') this.saveEditList(list);
    if (event.key === 'Escape') this.editingListId = null;
  }
}
