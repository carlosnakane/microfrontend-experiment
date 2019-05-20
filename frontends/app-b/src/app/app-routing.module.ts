import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeepLinkComponent } from './deep-link.component';

const routes: Routes = [
  {
    path: 'deep-link',
    component: DeepLinkComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
