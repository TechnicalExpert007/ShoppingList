import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lists',
    pathMatch: 'full'
  },
  {
    path: 'lists',
    loadComponent: () => 
      import('./pages/shopping-lists/shopping-lists.page').then(m => m.ShoppingListsPage)
  },
  {
    path: 'list/:id',
    loadComponent: () => 
      import('./pages/list-detail/list-detail-page').then(m => m.ListDetailPage)
  }
];