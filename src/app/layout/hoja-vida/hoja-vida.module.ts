import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HojaVidaRoutingModule} from './hoja-vida-routing.module';
import {HojaVidaComponent} from './hoja-vida.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatosPersonalesComponent} from './datos-personales/datos-personales.component';
import {EstudiosRealizadosComponent} from './estudios-realizados/estudios-realizados.component';
import {CapacitacionCursosComponent} from './capacitacion-cursos/capacitacion-cursos.component';
import {IdiomasComponent} from './idiomas/idiomas.component';
import {ExperienciaProfesionalComponent} from './experiencia-profesional/experiencia-profesional.component';
import {FortalezasComponent} from './fortalezas/fortalezas.component';
import {ReferenciasPersonalesComponent} from './referencias-personales/referencias-personales.component';
import {ProfessionalService} from '../../services/professional.service';

@NgModule({
  imports: [
    CommonModule,
    HojaVidaRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [ProfessionalService],
  declarations: [
    HojaVidaComponent,
    DatosPersonalesComponent,
    EstudiosRealizadosComponent,
    CapacitacionCursosComponent,
    IdiomasComponent,
    ExperienciaProfesionalComponent,
    FortalezasComponent,
    ReferenciasPersonalesComponent]
})
export class HojaVidaModule {
}
