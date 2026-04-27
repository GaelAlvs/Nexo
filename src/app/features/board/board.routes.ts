import { Routes } from '@angular/router';

export const boardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/board-detail/board-detail').then((m) => m.BoardDetail),
  },
];
