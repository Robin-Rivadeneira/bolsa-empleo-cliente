import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './layout/layout.module#LayoutModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'persona', loadChildren: './register/persona/persona.module#PersonaModule' },
  { path: 'empresa', loadChildren: './register/empresa/empresa.module#EmpresaModule' },
  { path: '**', loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
