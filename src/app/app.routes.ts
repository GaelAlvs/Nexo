import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'boards',
    loadChildren: () => import('./features/boards/boards.routes').then((m) => m.boardsRoutes),
  },
  {
    path: 'board/:id',
    loadChildren: () => import('./features/board/board.routes').then((m) => m.boardRoutes),
  },
  {
    path: '**',
    redirectTo: 'boards',
  },
];
