import {EmpresasRoutingModule} from './empresas-routing.module';
import {EmpresasComponent} from './empresas.component';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FiltroComponent} from './filtro/filtro.component';
import {DatosPostulanteComponent} from './datos-postulante/datos-postulante.component';
import {AuthService} from '../../services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    EmpresasRoutingModule
  ],
  declarations: [EmpresasComponent, FiltroComponent, DatosPostulanteComponent],
  providers: [AuthService]
})
export class EmpresasModule {
}
