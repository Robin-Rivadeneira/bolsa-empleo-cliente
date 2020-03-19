import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PersonaRoutingModule} from './persona-routing.module';
import {PersonaComponent} from './persona.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    PersonaRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [PersonaComponent],
  providers: [DatePipe]
})
export class PersonaModule {
}
