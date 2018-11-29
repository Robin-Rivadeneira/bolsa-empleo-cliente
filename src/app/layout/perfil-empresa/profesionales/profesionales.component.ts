import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import {EmpresaService} from '../../../services/empresa.service';
import {catalogos} from '../../../../environments/catalogos';
import {Professional} from '../../../models/professional';
import {Offer} from '../../../models/offer';
import {User} from '../../../models/user';
import {Company} from '../../../models/company';

@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styleUrls: ['./profesionales.component.css']
})
export class ProfesionalesComponent implements OnInit {

  actual_page: number;
  total_pages: number;
  records_per_page: number;
  offers: Array<Offer>;
  professionals: Array<Professional>;
  selectedProfessional: Professional;
  userLogged: User;
  messages: any;

  constructor(public empresaService: EmpresaService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.professionals = new Array<Professional>();
    this.selectedProfessional = new Professional();
    this.actual_page = 1;
    this.records_per_page = 5;
    this.messages = catalogos.messages;
    this.getProfessionals();
  }

  detachPostulant(selectedPostulant: Professional): void {
    this.empresaService.detachPostulant(
      {'user': this.userLogged, 'postulant': selectedPostulant}, this.userLogged.api_token)
      .subscribe(
        response => {
          if (response) {
            swal({
              position: this.messages['createSuccess']['position'],
              type: this.messages['createSuccess']['type'],
              // title: this.messages['createSuccess']['title'],
              title: response.valueOf().toString(),
              text: this.messages['createSuccess']['text'],
              timer: this.messages['createSuccess']['timer'],
              showConfirmButton: this.messages['createSuccess']['showConfirmButton'],
              backdrop: this.messages['createSuccess']['backdrop']
            });
          }
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

          if (error.status === 500) {
            swal({
              position: this.messages['createError500']['position'],
              type: this.messages['createError500']['type'],
              title: this.messages['createError500']['title'],
              text: this.messages['createError500']['text'],
              showConfirmButton: this.messages['createError500']['showConfirmButton'],
              backdrop: this.messages['createError500']['backdrop']
            });
          }
        });
  }

  getProfessionals() {
    this.empresaService.getAppliedProfessionals(this.actual_page, this.records_per_page, this.userLogged.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.professionals = response['professionals']['data'];
          if (response['pagination']['total'] === 0) {
            swal({
              position: 'center',
              type: 'info',
              title: 'Oops! no existen registros',
              text: 'Vuelve más tarde',
              showConfirmButton: true
            });
          }
        },
        error => {
          if (error.status === 401) {
            swal({
              position: 'center',
              type: 'error',
              title: 'Oops! no tienes autorización para acceder a este sitio',
              text: 'Vuelva a intentar',
              showConfirmButton: true
            });
          }
        });
  }

  openProfessional(content, professional: Professional, editar) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    if (editar) {
      this.selectedProfessional = professional;
    } else {
      this.selectedProfessional = new Professional();
    }
    this.modalService.open(content, logoutScreenOptions)
      .result
      .then((resultAceptar => {
        // const errores = this.validarCamposObligatorios(item);
        if (true) {
          if (resultAceptar === 'save') {
            if (editar) {
              //        this.actualizar();
            } else {
              //      this.insertar();
              //    this.agregarOferta();
            }
          }
        } else {
          /*swal({
            position: 'center',
            type: 'error',
            title: 'Los siguientes campos son requeridos:!',
            text: errores,
            showConfirmButton: true,
            timer: 15000
          });*/
        }
      }), (resultCancel => {

      }));
  }
}
