import {Component, OnInit} from '@angular/core';
import {OfertaService} from '../../../services/oferta.service';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import {catalogos} from '../../../../environments/catalogos';
import {Router} from '@angular/router';
import {PostulanteService} from '../../../services/postulante.service';
import {Offer} from '../../../models/offer';
import {User} from '../../../models/user';

@Component({
  selector: 'app-filtro-ofertas',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  filters: Array<String>;
  columns = new Array('code', 'province', 'broad_field', 'position', 'city', 'specific_field');
  operators = new Array('=', '=', 'like', 'like', 'like', '=');
  areas: Array<any>;
  etiquetaPrincipal: string;
  criterioBusqueda: string;

  userLogged: User;
  offers: Array<Offer>;
  selectedOffer: Offer;
  actual_page: number;
  records_per_page: number;
  total_pages: number;
  provinces: Array<any>;
  cantones: Array<any>;
  enable_city: boolean;
  camposEspecificos: Array<any>;
  validateOffer: boolean;
  messages: any;
  filterOption: string;
  filterColumnSingle: string;

  constructor(private modalService: NgbModal,
              public ofertaService: OfertaService,
              private postulanteService: PostulanteService,
              private router: Router) {
  }

  ngOnInit() {
    this.validateOffer = false;
    this.provinces = catalogos.provincias;
    this.areas = catalogos.titulos;
    this.filters = new Array<String>();
    this.actual_page = 1;
    this.records_per_page = 20;
    this.total_pages = 1;
    this.messages = catalogos.messages;
    if (sessionStorage.getItem('user_logged')) {
      this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    } else {
      this.userLogged = new User();
    }

    this.getOffers();
    this.criterioBusqueda = '';
    this.paginacion(true);
    this.countOffers();

  }

  paginacion(siguiente: boolean) {
    if (siguiente) {
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
    if (this.filters.length === 0 && (this.etiquetaPrincipal == '' || this.etiquetaPrincipal == null)) {
      this.getOffers();
    } else {
      switch (this.filterOption) {
        case 'single':
          break;
        case 'field':
          this.filterOffersField();
          break;
        case 'filter':
          this.filterOffers();
          break;
      }

    }

  }

  openOfertaLaboral(content, item: Offer, editar) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.selectedOffer = item;
    this.validateAppliedOffer();
    this.modalService.open(content, logoutScreenOptions)
      .result
      .then((resultAceptar => {
        if (resultAceptar === 'aplicar') {
          this.applyOffer();
        }

      }), (resultCancel => {

      }));
  }

  validateAppliedOffer() {
    this.ofertaService.validateAppliedOffer(this.userLogged.id, this.selectedOffer.id).subscribe(response => {
      if (response) {
        this.validateOffer = true;
      } else {
        this.validateOffer = false;
      }
    });
  }

  openFilter(content, item: Offer, editar) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.selectedOffer = item;
    this.filters = new Array<String>();

    this.modalService.open(content, logoutScreenOptions)
      .result
      .then((resultAceptar => {
        if (resultAceptar === 'aplicar') {
          this.etiquetaPrincipal = null;
          this.filterOffers();
        }

      }), (resultCancel => {

      }));
  }

  filterOffers() {
    this.filterOption = 'filter';
    this.etiquetaPrincipal = null;
    let condition = [];
    const conditions = [];
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i] != null && this.filters[i] !== '') {
        condition.push(this.columns[i]);
        condition.push(this.operators[i]);
        condition.push(this.filters[i]);
        conditions.push(condition);
        condition = [];
      }
    }
    console.log(conditions);
    this.ofertaService.filterOffers({'filters': {'conditions': conditions}}, this.actual_page, this.records_per_page).subscribe(
      response => {
        this.offers = response['offers']['data'];
        if (response['pagination']['total'] === 0) {
          swal({
            title: 'Oops! No encotramos lo que estás buscando',
            text: 'Intenta otra vez!',
            type: 'info',
            timer: 3500
          });
          this.total_pages = 1;
        } else {
          this.total_pages = response['pagination']['last_page'];
        }
      });
  }

  filterOffersField() {
    this.filterOption = 'field';
    this.ofertaService.filterOffersField(this.criterioBusqueda, this.actual_page, this.records_per_page).subscribe(
      response => {
        this.offers = response['offers']['data'];
        if (response['pagination']['total'] === 0) {
          swal({
            title: 'Oops! No encotramos lo que estás buscando',
            text: 'Intenta otra vez!',
            type: 'info',
            timer: 3500
          });
          this.total_pages = 1;
        } else {
          this.total_pages = response['pagination']['last_page'];
        }
      });
  }

  filterOffersSingle(column, item) {
    this.filterOption = 'single';
    this.etiquetaPrincipal = item;
    this.filters = null;
    const condition = [];
    const conditions = [];
    condition.push(column);
    condition.push('like');
    condition.push(item);
    conditions.push(condition);
    this.ofertaService.filterOffers({'filters': {'conditions': conditions}}, this.actual_page, this.records_per_page).subscribe(
      response => {
        this.offers = response['offers']['data'];
        if (response['pagination']['total'] === 0) {
          swal({
            title: 'Oops! No encotramos lo que estás buscando',
            text: 'Intenta otra vez!',
            type: 'info',
            timer: 3500
          });
          this.total_pages = 1;
        } else {
          this.total_pages = response['pagination']['last_page'];
        }
      });
  }

  cleanFilter(filter) {
    this.filters.splice(this.filters.indexOf(filter), 1);
    this.etiquetaPrincipal = null;
    if (this.filters.length === 0) {
      this.getOffers();
    } else {
      this.filterOffers();
    }

  }

  cleanFilterSingle() {
    this.etiquetaPrincipal = null;
    this.getOffers();
  }

  countOffers() {
    this.ofertaService.getAllOffers().subscribe(
      response => {
        console.log('entro');
        this.contarOfertasPorCampoAmplio(response['offers']);
        this.contarOfertasPorCampoEspecifico(response['offers']);
      });
  }

  contarOfertasPorCampoAmplio(offers: Array<Offer>) {
    this.areas.forEach(area => {
      area.total = 0;
    });
    offers.forEach(offer => {
      this.areas.forEach(area => {
        if (offer.broad_field === area.campo_amplio) {
          area.total = area.total + 1;
        }
      });
    });
  }

  contarOfertasPorCampoEspecifico(offers: Array<Offer>) {
    this.areas.forEach(area => {
      area.campos_especificos.forEach(areaEspecifica => {
        areaEspecifica.total = 0;
      });
    });
    offers.forEach(oferta => {
      this.areas.forEach(area => {
        area.campos_especificos.forEach(areaEspecifica => {
          if (oferta.specific_field === areaEspecifica.nombre) {
            areaEspecifica.total = areaEspecifica.total + 1;
          }
        });
      });
    });
  }

  validateSession(content, item: Offer, editar) {
    if (!(this.userLogged == null)) {
      if (this.userLogged.role.toString() === '1') {
        this.openOfertaLaboral(content, item, editar);
      } else {
        swal({
          title: 'Para ver más Información tiene que iniciar sesión como Profesional',
          text: '',
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#3085d6',
          confirmButtonText: '<i class="fa fa-sign-in" aria-hidden="true"> Iniciar Sesión</i>',
          cancelButtonText: '<i class="fa fa-address-book" aria-hidden="true"> Regístrate</i>'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['login']);
          } else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
          ) {
            this.router.navigate(['persona']);
          }
        });
      }
    } else {
      swal({
        title: 'Para ver más Información tiene que iniciar sesión como Profesional',
        text: '',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '<i class="fa fa-sign-in" aria-hidden="true"> Iniciar Sesión</i>',
        cancelButtonText: '<i class="fa fa-address-book" aria-hidden="true"> Regístrate</i>'
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['login']);
        } else if (
          // Read more about handling dismissals
          result.dismiss === swal.DismissReason.cancel
        ) {
          this.router.navigate(['persona']);
        }
      });
    }

  }

  getOffers(): void {
    this.ofertaService.getOffers(this.actual_page, this.records_per_page).subscribe(response => {
      this.offers = response['offers']['data'];
      if (response['pagination']['total'] === 0) {
        this.total_pages = 1;
      } else {
        this.total_pages = response['pagination']['last_page'];
      }
    });
  }

  filtrarCantones(item) {
    this.cantones = [];
    this.enable_city = true;
    this.provinces.forEach(value => {
      if (item === value.provincia) {
        this.cantones = value.cantones;
      }
    });
  }

  filtrarCamposEspecificos(item) {
    this.camposEspecificos = [];
    this.areas.forEach(value => {
      if (item === value.campo_amplio) {
        this.camposEspecificos = value.campos_especificos;
      }
    });
  }

  applyOffer(): void {
    this.ofertaService.applyOffer(
      {'user': this.userLogged, 'offer': this.selectedOffer}, this.userLogged.api_token)
      .subscribe(
        response => {
          if (response) {
            swal({
              position: this.messages['createSuccess']['position'],
              type: this.messages['createSuccess']['type'],
              title: this.messages['createSuccess']['title'],
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
}
