import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import {EmpresaService} from '../../../services/empresa.service';
import {Oferta} from '../../../models/oferta';
import {FirebaseBDDService} from '../../../services/firebase-bdd.service';
import {catalogos} from '../../../../environments/catalogos';
import {Professional} from '../../../models/professional';
import {AuthService} from '../../../services/auth.service';
import {Offer} from '../../../models/offer';
import {User} from '../../../models/user';

@Component({
  selector: 'app-ofertas-laborales',
  templateUrl: './ofertas-laborales.component.html',
  styleUrls: ['./ofertas-laborales.component.css']
})
export class OfertasLaboralesComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  ofertaSeleccionada: Offer;
  duracionOferta: number;
  areas: Array<any>;
  provincias: Array<any>;
  cantones: Array<any>;
  camposEspecificos: Array<any>;
  habilitarCamposEspecificos: boolean;
  habilitarCantones: boolean;

  actual_page: number;
  total_pages: number;
  records_per_page: number;
  offers: Array<Offer>;
  professionals: Array<Professional>;
  selectedOffer: Offer;
  userLogged: User;
  messages: any;

  constructor(public empresaService: EmpresaService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.offers = new Array<Offer>();
    this.selectedOffer = new Offer();
    this.actual_page = 1;
    this.records_per_page = 5;
    this.duracionOferta = 0;
    this.messages = catalogos.messages;
    this.habilitarCamposEspecificos = false;
    this.habilitarCantones = false;
    this.ofertaSeleccionada = new Offer();
    this.areas = catalogos.titulos;
    this.provincias = catalogos.provincias;
    this.getOffers();
  }

  calcularFechaFinOferta() {

  }

  openOfertaLaboral(content, offer: Offer, editar) {
    const errores = this.validarCamposObligatorios(this.selectedOffer);
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    if (editar) {
      this.selectedOffer = offer;
      this.filtrarCamposEspecificos(offer);
      this.filtrarCantones(offer);
    } else {
      this.selectedOffer = new Offer();
      this.calculateFinishDate();
    }

    this.modalService.open(content, logoutScreenOptions)
      .result
      .then((resultAceptar => {
        if (true) {
          if (resultAceptar === 'save') {
            if (editar) {
              this.updateOffer(this.selectedOffer);
            } else {
              this.createOffer(this.selectedOffer);
            }
          }
        } else {
        }
      }), (resultCancel => {

      }));
  }

  compararFechas(fechaMenor: any, fechaMayor: any): boolean {
    const fechaInicio = new Date(fechaMenor.year + '/' + fechaMenor.month + '/' + fechaMenor.day);
    const fechaFin = new Date(fechaMayor.year + '/' + fechaMayor.month + '/' + fechaMayor.day);
    if (fechaFin < fechaInicio) {
      swal({
        position: 'center',
        type: 'warning',
        title: 'Datos Incorrectos',
        text: 'Hay un error en las fechas ingresadas.',
        showConfirmButton: false,
        timer: 2000
      });
      return false;
    }
    return true;
  }

  openFiltro(content) {
    this.modalService.open(content)
      .result
      .then((resultAceptar => {

      }), (resultCancel => {

      }));
  }

  openPostulantes(content, offer: Offer) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.getProfessionals(offer.id);
    this.modalService.open(content, logoutScreenOptions)
      .result
      .then((resultAceptar => {

      }), (resultCancel => {

      }));
  }

  filtrarCantones(item) {
    this.cantones = [];
    this.habilitarCantones = true;
    this.provincias.forEach(value => {
      if (item.province === value.provincia) {
        this.cantones = value.cantones;
      }
    });
  }

  filtrarCamposEspecificos(item) {
    this.camposEspecificos = [];
    this.habilitarCamposEspecificos = true;
    this.areas.forEach(value => {
      if (item.broad_field === value.campo_amplio) {
        this.camposEspecificos = value.campos_especificos;
      }
    });
  }

  validarCamposObligatorios(oferta: Offer): string {
    let errores = 'save';
    if (oferta.code == null || oferta.code === '') {
      errores = errores + 'Código';
    }
    // if (oferta.contacto == null || oferta.contacto == '') {errores = errores + ', Contacto';}
    // if (oferta.correoElectronico == null || oferta.correoElectronico == '') {errores = errores + ', Correo Electrónico';}
    return errores;
  }

  getOffers(): void {
    this.empresaService.getOffers(this.actual_page, this.records_per_page, this.userLogged.id, this.userLogged.api_token).subscribe(
      response => {
        this.offers = response['offers']['data'];
        this.total_pages = response['pagination']['last_page'];
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
            title: 'Usuario y/o Contraseña incorrectas',
            text: 'Vuelva a intentar',
            showConfirmButton: true
          });
        }
      });
  }

  getProfessionals(offer_id: number): void {
    this.empresaService.getProfessionals(this.actual_page, this.total_pages, offer_id, this.userLogged.api_token).subscribe(
      response => {
        this.professionals = response['professionals']['data'];
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

  createOffer(offer: Offer): void {
    this.empresaService.createOffer({'company': this.userLogged, 'offer': this.selectedOffer}, this.userLogged.api_token).subscribe(
      response => {
        swal({
          position: 'center',
          type: 'success',
          title: 'Sus datos fueron ingresados correctamente',
          text: '',
          showConfirmButton: true
        });
        this.getOffers();
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

        if (error.valueOf().error.errorInfo[0] === '22007') {
          swal({
            position: 'center',
            type: 'error',
            title: 'El formato de fecha no es el correcto',
            text: 'Vuelva a intentar',
            showConfirmButton: true
          });
        }
      });
  }

  updateOffer(offer: Offer): void {
    this.empresaService.updateOffer({'offer': this.selectedOffer}, this.userLogged.api_token).subscribe(
      response => {
        this.getOffers();
        swal({
          position: this.messages['updateSuccess']['position'],
          type: this.messages['updateSuccess']['type'],
          title: this.messages['updateSuccess']['title'],
          text: this.messages['updateSuccess']['text'],
          timer: this.messages['updateSuccess']['timer'],
          showConfirmButton: this.messages['updateSuccess']['showConfirmButton'],
          backdrop: this.messages['updateSuccess']['backdrop']
        });
      },
      error => {
        console.log(error);
        if (error.status === 401) {
          swal({
            position: this.messages['updateError401']['position'],
            type: this.messages['updateError401']['type'],
            title: this.messages['updateError401']['title'],
            text: this.messages['updateError401']['text'],
            showConfirmButton: this.messages['updateError401']['showConfirmButton'],
            backdrop: this.messages['updateError401']['backdrop']
          });
        }

        if (error.status === 500) {
          swal({
            position: this.messages['updateError500']['position'],
            type: this.messages['updateError500']['type'],
            title: this.messages['updateError500']['title'],
            text: this.messages['updateError500']['text'],
            showConfirmButton: this.messages['updateError500']['showConfirmButton'],
            backdrop: this.messages['updateError500']['backdrop']
          });
        }

        if (error.valueOf().error.errorInfo[0] === '22007') {
          swal({
            position: 'center',
            type: 'error',
            title: 'El formato de fecha no es el correcto',
            text: 'Vuelva a intentar',
            showConfirmButton: true
          });
        }
      });
  }

  deleteOffer(offer: Offer): void {
    swal({
      position: this.messages['deleteQuestion']['position'],
      type: this.messages['deleteQuestion']['type'],
      title: this.messages['deleteQuestion']['title'],
      text: this.messages['deleteQuestion']['text'],
      showConfirmButton: this.messages['deleteQuestion']['showConfirmButton'],
      showCancelButton: this.messages['deleteQuestion']['showCancelButton'],
      confirmButtonColor: this.messages['deleteQuestion']['confirmButtonColor'],
      cancelButtonColor: this.messages['deleteQuestion']['cancelButtonColor'],
      confirmButtonText: this.messages['deleteQuestion']['confirmButtonText'],
      cancelButtonText: this.messages['deleteQuestion']['cancelButtonText'],
      reverseButtons: this.messages['deleteQuestion']['reverseButtons'],
      backdrop: this.messages['deleteQuestion']['backdrop'],
    }).then((result) => {
      if (result.value) {
        this.empresaService.deleteOffer(offer.id, this.userLogged.api_token).subscribe(
          response => {
            this.getOffers();
            swal({
              position: this.messages['deleteSuccess']['position'],
              type: this.messages['deleteSuccess']['type'],
              title: this.messages['deleteSuccess']['title'],
              text: this.messages['deleteSuccess']['text'],
              timer: this.messages['deleteSuccess']['timer'],
              showConfirmButton: this.messages['deleteSuccess']['showConfirmButton'],
              backdrop: this.messages['deleteSuccess']['backdrop'],
            });
          },
          error => {
            if (error.status === 401) {
              swal({
                position: this.messages['deleteError401']['position'],
                type: this.messages['deleteError401']['type'],
                title: this.messages['deleteError401']['title'],
                text: this.messages['deleteError401']['text'],
                showConfirmButton: this.messages['deleteError401']['showConfirmButton'],
                backdrop: this.messages['deleteError401']['backdrop']
              });
            }

            if (error.status === 500) {
              swal({
                position: this.messages['deleteError500']['position'],
                type: this.messages['deleteError500']['type'],
                title: this.messages['deleteError500']['title'],
                text: this.messages['deleteError500']['text'],
                showConfirmButton: this.messages['deleteError500']['showConfirmButton'],
                backdrop: this.messages['deleteError500']['backdrop']
              });
            }
          });
      }
    });
  }

  finishOffer(offer: Offer): void {
    swal({
      position: this.messages['finishQuestion']['position'],
      type: this.messages['finishQuestion']['type'],
      title: this.messages['finishQuestion']['title'],
      text: this.messages['finishQuestion']['text'],
      showConfirmButton: this.messages['finishQuestion']['showConfirmButton'],
      showCancelButton: this.messages['finishQuestion']['showCancelButton'],
      confirmButtonColor: this.messages['finishQuestion']['confirmButtonColor'],
      cancelButtonColor: this.messages['finishQuestion']['cancelButtonColor'],
      confirmButtonText: this.messages['finishQuestion']['confirmButtonText'],
      cancelButtonText: this.messages['finishQuestion']['cancelButtonText'],
      reverseButtons: this.messages['finishQuestion']['reverseButtons'],
      backdrop: this.messages['finishQuestion']['backdrop'],
    }).then((result) => {
      if (result.value) {
        this.empresaService.finishOffer(offer.id, this.userLogged.api_token).subscribe(
          response => {
            this.getOffers();
            swal({
              position: this.messages['deleteSuccess']['position'],
              type: this.messages['deleteSuccess']['type'],
              title: this.messages['deleteSuccess']['title'],
              text: this.messages['deleteSuccess']['text'],
              timer: this.messages['deleteSuccess']['timer'],
              showConfirmButton: this.messages['deleteSuccess']['showConfirmButton'],
              backdrop: this.messages['deleteSuccess']['backdrop'],
            });
          },
          error => {
            if (error.status === 401) {
              swal({
                position: this.messages['deleteError401']['position'],
                type: this.messages['deleteError401']['type'],
                title: this.messages['deleteError401']['title'],
                text: this.messages['deleteError401']['text'],
                showConfirmButton: this.messages['deleteError401']['showConfirmButton'],
                backdrop: this.messages['deleteError401']['backdrop']
              });
            }

            if (error.status === 500) {
              swal({
                position: this.messages['deleteError500']['position'],
                type: this.messages['deleteError500']['type'],
                title: this.messages['deleteError500']['title'],
                text: this.messages['deleteError500']['text'],
                showConfirmButton: this.messages['deleteError500']['showConfirmButton'],
                backdrop: this.messages['deleteError500']['backdrop']
              });
            }
          });
      }
    });
  }

  pagination(next: boolean) {
    if (next) {
      if (this.actual_page === this.total_pages) {
        return;
      } else {
        this.actual_page++;
      }
    } else {
      if (this.actual_page === 1) {
        return;
      } else {
        this.actual_page--;
      }
    }
    this.getOffers();
  }

  calculateFinishDate() {
    if (this.selectedOffer.start_date != null && this.selectedOffer.start_date.toString() !== '') {
      this.selectedOffer.finish_date = new Date(this.selectedOffer.start_date.toString() + ' GMT-0500');
      this.selectedOffer.finish_date.setMonth(this.selectedOffer.finish_date.getMonth() + 1);
    } else {
      this.selectedOffer.finish_date = null;
    }
  }
}
