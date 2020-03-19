import {Component, OnInit, ViewChild} from '@angular/core';
import {catalogos} from '../../../../environments/catalogos';
import swal from 'sweetalert2';
import {Professional} from '../../../models/professional';
import {User} from '../../../models/user';
import {ProfessionalService} from '../../../services/professional.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  srcFoto: string;
  fechaNacimientoMaxima: string;
  nacionalidades: Array<any>;
  estadosCiviles: Array<any>;
  sexos: Array<any>;
  professional: Professional;
  userLogged: User;
  messages: any;
  totalCaracteresAboutMe: string;

  constructor(public postulanteService: ProfessionalService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.messages = catalogos.messages;
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.professional = new Professional();
    this.nacionalidades = catalogos.nacionalidades;
    this.estadosCiviles = catalogos.estadosCiviles;
    this.sexos = catalogos.sexos;
    this.getProfessional();
    this.validarFechaMaximaNacimiento();
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

  validarSoloNumeros(cadena) {
    const expreg = /^[0-9]*$/;
    return expreg.test(cadena);
  }

  validarSoloLetrasConEspacio(cadena) {
    const expreg = /^[A-Z_ ]+([A-Z]+)*$/;
    return expreg.test(cadena.toUpperCase());
  }

  validarFechaMaximaNacimiento() {
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 18);
    this.fechaNacimientoMaxima = this.datePipe.transform(fechaActual, 'yyyy-MM-dd');
  }
}
