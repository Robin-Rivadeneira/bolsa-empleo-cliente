import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit} from '@angular/core';
import {PostulanteService} from '../../services/postulante.service';
import swal from 'sweetalert2';
import {EmpresaService} from '../../services/empresa.service';
import {User} from '../../models/user';
import {Offer} from '../../models/offer';
import {Company} from '../../models/company';

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {

  selectedOffer: Offer;
  selectedCompany: Company;
  offers: Array<Offer>;
  companies: Array<Company>;
  userLogged: User;
  actual_page: number;
  total_pages: number;
  records_per_page: number;

  constructor(private postulanteService: PostulanteService, private empresaService: EmpresaService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.selectedOffer = new Offer();
    this.selectedCompany = new Company();
    this.actual_page = 1;
    this.records_per_page = 5;
    this.getMisPostulaciones();
    this.getCompanies();
  }

  open(content) {
    this.modalService.open(content)
      .result
      .then((resultModal => {

      }), (resultCancel => {

      }));
  }

  getMisPostulaciones() {
    this.postulanteService.getAppliedOffers(this.actual_page, this.records_per_page, this.userLogged.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.offers = response['offers']['data'];
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

  getCompanies() {
    this.postulanteService.getAppliedCompanies(this.actual_page, this.records_per_page, this.userLogged.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.companies = response['companies']['data'];
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

  openOfertaLaboral(content, oferta: Offer, editar) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    if (editar) {
      this.selectedOffer = oferta;
    } else {
      this.selectedOffer = new Offer();
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

  openCompany(content, company: Company, editar) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    if (editar) {
      this.selectedCompany = company;
    } else {
      this.selectedCompany = new Company();
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
