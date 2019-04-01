import {Component, OnInit, ViewChild} from '@angular/core';
import {catalogos} from '../../../../environments/catalogos';
import swal from 'sweetalert2';
import {Professional} from '../../../models/professional';
import {User} from '../../../models/user';
import {ProfessionalService} from '../../../services/professional.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  srcFoto: string;
  nacionalidades: Array<any>;
  estadosCiviles: Array<any>;
  sexos: Array<any>;
  professional: Professional;
  userLogged: User;
  messages: any;

  constructor(public postulanteService: ProfessionalService) {
  }

  ngOnInit() {
    this.messages = catalogos.messages;
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.professional = new Professional();
    this.nacionalidades = catalogos.nacionalidades;
    this.estadosCiviles = catalogos.estadosCiviles;
    this.sexos = catalogos.sexos;
    this.getProfessional();
  }

  updateProfessional(): void {
    this.postulanteService.updateProfessional({'professional': this.professional}, this.userLogged.api_token).subscribe(
      response => {
        this.getProfessional();
        swal({
          position: 'center',
          type: 'success',
          title: 'Los datos fueron actualizados',
          text: '',
          timer: 2000,
          showConfirmButton: true
        });
      },
      error => {
        if (error.status === 401) {
          swal({
            position: 'center',
            type: 'error',
            title: 'Oops! no tiene los permisos necesarios',
            text: 'Vuelva a intentar',
            showConfirmButton: true
          });
        } else {
          console.log(error);
        }
      });
  }

  getProfessional(): void {
    this.postulanteService.getProfessional(this.userLogged.id, this.userLogged.api_token).subscribe(
      response => {
        this.professional = response['professional'];
      },
      error => {
        if (error.status === 401) {
          swal({
            position: this.messages['createError401']['position'],
            type: this.messages['createError401']['type'],
            title: this.messages['createError401']['title'],
            text: this.messages['createError401']['text'],
            showConfirmButton: this.messages['createError401']['showConfirmButton'],
            backdrop: this.messages['createError401']['backdrop']
          });
        }
      });
  }
}
