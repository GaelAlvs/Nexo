import { Routes } from '@angular/router';

export const boardsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/boards-list/boards-list').then((m) => m.BoardsList),
  },
];
