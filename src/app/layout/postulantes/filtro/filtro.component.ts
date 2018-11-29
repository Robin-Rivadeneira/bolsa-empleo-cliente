import {catalogos} from './../../../../environments/catalogos';
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {EmpresaService} from '../../../services/empresa.service';
import {PostulanteService} from '../../../services/postulante.service';
import {Offer} from '../../../models/offer';
import {User} from '../../../models/user';
import {OfertaService} from '../../../services/oferta.service';
import {Professional} from '../../../models/professional';
import {AcademicFormation} from '../../../models/academic-formation';
import {Course} from '../../../models/course';
import {Language} from '../../../models/language';
import {ProfessionalReference} from '../../../models/professionalReference';
import {ProfessionalExperience} from '../../../models/professionalExperience';
import {Ability} from '../../../models/ability';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  filters: Array<String>;
  columns = new Array('code', 'province', 'broad_field', 'position', 'city', 'specific_field');
  operators = new Array('=', '=', 'like', 'like', 'like', '=');
  areas: Array<any>;
  abilities: Array<Ability>;
  academicFormations: Array<AcademicFormation>;
  courses: Array<Course>;
  languages: Array<Language>;
  professionalReferences: Array<ProfessionalReference>;
  professionalExperiences: Array<ProfessionalExperience>;
  etiquetaPrincipal: string;
  criterioBusqueda: string;
  userLogged: User;
  offers: Array<Offer>;
  postulants: Array<Professional>;
  selectedPostulant: Professional;
  selectedOffer: Offer;
  actual_page: number;
  records_per_page: number;
  total_pages: number;
  provinces: Array<any>;
  cantones: Array<any>;
  enable_city: boolean;
  camposEspecificos: Array<any>;
  validatePostulant: boolean;
  messages: any;
  filterOption: string;
  filterColumnSingle: string;

  constructor(
    private postulanteService: PostulanteService,
    public ofertaService: OfertaService,
    private empresaService: EmpresaService,
    private modalService: NgbModal,
    private router: Router) {
  }

  ngOnInit() {
    this.validatePostulant = false;
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

    this.getPostulants();
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
      this.getPostulants();
    } else {
      switch (this.filterOption) {
        case 'single':
          break;
        case 'field':
          this.filterPostulantsField();
          break;
        case 'filter':
          this.filterPostulants();
          break;
      }

    }

  }

  openOfertaLaboral(content, item: Professional, editar) {
    const logoutScreenOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.selectedPostulant = item;
    this.getAbilities();
    this.getAcademicFormations();
    this.getCourses();
    this.getLanguages();
    this.getProfessionalExperiences();
    this.getProfessionalReferences();
    this.validateAppliedPostulant();
    this.modalService.open(content, logoutScreenOptions)
      .result
      .then((resultAceptar => {
        if (resultAceptar === 'aplicar') {
          this.applyPostulant();
        }

      }), (resultCancel => {

      }));
  }

  getAbilities(): void {
    this.postulanteService.getAbilities(this.actual_page, this.records_per_page, this.selectedPostulant.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.abilities = response['abilities']['data'];
          this.total_pages = response['pagination']['last_page'];
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

  getAcademicFormations(): void {
    this.postulanteService.getAcademicFormations(this.actual_page, this.records_per_page, this.selectedPostulant.id, this.userLogged.api_token)
      .subscribe(
        response => {
          console.log('academicFormations');
          console.log(response['academicFormations']);
          this.academicFormations = response['academicFormations']['data'];
          this.total_pages = response['pagination']['last_page'];
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

  getCourses(): void {
    this.postulanteService.getCourses(this.actual_page, this.records_per_page, this.selectedPostulant.id, this.userLogged.api_token)
      .subscribe(
        response => {
          console.log('Courses');
          console.log(response['Courses']);
          this.courses = response['courses']['data'];
          this.total_pages = response['pagination']['last_page'];
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

  getLanguages(): void {
    this.postulanteService.getLanguages(this.actual_page, this.records_per_page, this.selectedPostulant.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.languages = response['languages']['data'];
          this.total_pages = response['pagination']['last_page'];
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

  getProfessionalReferences(): void {
    this.postulanteService.getProfessionalReferences(this.actual_page, this.records_per_page, this.selectedPostulant.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.professionalReferences = response['professionalReferences']['data'];
          this.total_pages = response['pagination']['last_page'];
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

  getProfessionalExperiences(): void {
    this.postulanteService.getProfessionalExperiences(this.actual_page, this.records_per_page, this.selectedPostulant.id, this.userLogged.api_token)
      .subscribe(
        response => {
          console.log('Courses');
          console.log(response['Courses']);
          this.professionalExperiences = response['professionalExperiences']['data'];
          this.total_pages = response['pagination']['last_page'];
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

  validateAppliedPostulant() {
    this.postulanteService.validateAppliedPostulant(this.userLogged.id, this.selectedPostulant.id).subscribe(response => {
      if (response) {
        this.validatePostulant = true;
      } else {
        this.validatePostulant = false;
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
          this.filterPostulants();
        }

      }), (resultCancel => {

      }));
  }

  filterPostulants() {
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
    this.postulanteService.filterPostulants({'filters': {'conditions': conditions}}, this.actual_page, this.records_per_page).subscribe(
      response => {
        this.postulants = response['postulants']['data'];
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

  filterPostulantsField() {
    this.filterOption = 'field';
    this.postulanteService.filterPostulantsField(this.criterioBusqueda, this.actual_page, this.records_per_page).subscribe(
      response => {
        this.postulants = response['postulants']['data'];
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

  filterPostulantsSingle(column, item) {
    this.filterOption = 'single';
    this.etiquetaPrincipal = item;
    this.filters = null;
    const condition = [];
    const conditions = [];
    condition.push(column);
    condition.push('like');
    condition.push(item);
    conditions.push(condition);
    this.postulanteService.filterPostulants({'filters': {'conditions': conditions}}, this.actual_page, this.records_per_page).subscribe(
      response => {
        this.postulants = response['postulants']['data'];
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
      this.getPostulants();
    } else {
      this.filterPostulants();
    }

  }

  cleanFilterSingle() {
    this.etiquetaPrincipal = null;
    this.getPostulants();
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

  validateSession(content, item: Professional, editar) {
    if (!(this.userLogged == null)) {
      if (this.userLogged.role.toString() === '2') {
        this.openOfertaLaboral(content, item, editar);
      } else {
        swal({
          title: 'Para ver más Información tiene que iniciar sesión como Empresa',
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

  getPostulants(): void {
    this.postulanteService.getPostulants(this.actual_page, this.records_per_page).subscribe(response => {
      this.postulants = response['postulants']['data'];
      console.log('this.postulants');
      console.log(this.postulants);
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

  applyPostulant(): void {
    this.empresaService.applyPostulant(
      {'user': this.userLogged, 'postulant': this.selectedPostulant}, this.userLogged.api_token)
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
