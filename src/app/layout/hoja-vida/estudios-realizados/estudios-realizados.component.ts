import {catalogos} from './../../../../environments/catalogos';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PostulanteService} from './../../../services/postulante.service';
import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert2';
import {User} from '../../../models/user';
import {AcademicFormation} from '../../../models/academic-formation';
import {ProfessionalService} from '../../../services/professional.service';

@Component({
  selector: 'app-estudios-realizados',
  templateUrl: './estudios-realizados.component.html',
  styleUrls: ['./estudios-realizados.component.css']
})
export class EstudiosRealizadosComponent implements OnInit {
  academicFormations: Array<AcademicFormation>;
  selectedAcademicFormation: AcademicFormation;
  actual_page: number;
  records_per_page: number;
  total_pages: number;
  flagPagination: boolean;
  messages: any;
  userLogged: User;
  titles: Array<any>;
  tipo_titulo: Array<any>;
  instituciones: Array<any>;

  constructor(private modalService: NgbModal, public postulanteService: ProfessionalService) {
  }

  ngOnInit() {
    this.actual_page = 1;
    this.records_per_page = 4;
    this.total_pages = 1;
    this.flagPagination = false;
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.selectedAcademicFormation = new AcademicFormation();
    this.titles = catalogos.titulos;
    this.instituciones = catalogos.instituciones;
    this.messages = catalogos.messages;
    this.getAcademicFormations();
    this.filterProfessionalDegree();
  }

  paginate(siguiente: boolean) {
    this.flagPagination = true;
    if (siguiente) {
      if (this.actual_page === this.total_pages) {
        this.flagPagination = false;
        return;
      } else {
        this.actual_page++;
      }
    } else {
      if (this.actual_page === 1) {
        this.flagPagination = false;
        return;
      } else {
        this.actual_page--;
      }
    }
    this.getAcademicFormations();
  }

  open(content, selectedAcademicFormation: AcademicFormation, editar) {
    if (editar) {
      this.selectedAcademicFormation = selectedAcademicFormation;
      this.filterProfessionalDegree();
    } else {
      this.selectedAcademicFormation = new AcademicFormation();
    }
    this.modalService.open(content)
      .result
      .then((resultModal => {
        if (resultModal === 'save') {
          if (editar) {
            this.updateAcademicFormation();
          } else {
            this.createAcademicFormation();
          }
        }
      }), (resultCancel => {

      }));
  }

  getAcademicFormations(): void {
    this.postulanteService.getAcademicFormations(this.actual_page, this.records_per_page, this.userLogged.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.academicFormations = response['academicFormations']['data'];
          this.total_pages = response['pagination']['last_page'];
          this.flagPagination = false;
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

  createAcademicFormation(): void {
    this.postulanteService.createAcademicFormation(
      {'academicFormation': this.selectedAcademicFormation, 'user': this.userLogged}, this.userLogged.api_token)
      .subscribe(
        response => {
          this.getAcademicFormations();
          swal({
            position: this.messages['createSuccess']['position'],
            type: this.messages['createSuccess']['type'],
            title: this.messages['createSuccess']['title'],
            text: this.messages['createSuccess']['text'],
            timer: this.messages['createSuccess']['timer'],
            showConfirmButton: this.messages['createSuccess']['showConfirmButton'],
            backdrop: this.messages['createSuccess']['backdrop']
          });
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

  updateAcademicFormation(): void {
    this.postulanteService.updateAcademicFormation({'academicFormation': this.selectedAcademicFormation}, this.userLogged.api_token)
      .subscribe(
        response => {
          this.getAcademicFormations();
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
        });
  }

  deleteAcademicFormation(academicFormation: AcademicFormation): void {
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
        this.postulanteService.deleteAcademicFormation(academicFormation.id, this.userLogged.api_token).subscribe(
          response => {
            this.getAcademicFormations();
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

  filterProfessionalDegree() {
    this.titles.forEach(titulo => {
      if (this.selectedAcademicFormation.career === '') {
        this.tipo_titulo = null;
        return;
      }
      if (titulo.campo_amplio === this.selectedAcademicFormation.career) {
        this.tipo_titulo = titulo.campos_especificos;
      }
    });
  }
}
