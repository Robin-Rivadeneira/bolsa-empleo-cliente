import {ProfessionalExperience} from './../../../models/professionalExperience';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PostulanteService} from './../../../services/postulante.service';
import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert2';
import {User} from '../../../models/user';
import {catalogos} from '../../../../environments/catalogos';
import {ProfessionalService} from '../../../services/professional.service';

@Component({
  selector: 'app-experiencia-profesional',
  templateUrl: './experiencia-profesional.component.html',
  styleUrls: ['./experiencia-profesional.component.css']
})
export class ExperienciaProfesionalComponent implements OnInit {
  professionalExperiences: Array<ProfessionalExperience>;
  selectedProfessionalExperience: ProfessionalExperience;
  actual_page: number;
  records_per_page: number;
  total_pages: number;
  flagPagination: boolean;
  messages: any;
  userLogged: User;
  instituciones: Array<any>;
  tiposEvento: Array<any>;
  current_work: boolean;

  constructor(
    private modalService: NgbModal,
    public postulanteService: ProfessionalService) {
  }

  ngOnInit() {
    this.actual_page = 1;
    this.records_per_page = 4;
    this.total_pages = 1;
    this.flagPagination = false;
    this.current_work = false;
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.selectedProfessionalExperience = new ProfessionalExperience();
    this.instituciones = catalogos.instituciones;
    this.tiposEvento = catalogos.tiposEvento;
    this.messages = catalogos.messages;
    this.getProfessionalExperiences();

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
    this.getProfessionalExperiences();
  }

  open(content, selectedProfessionalExperience: ProfessionalExperience, editar) {
    if (editar) {
      this.selectedProfessionalExperience = selectedProfessionalExperience;
    } else {
      this.selectedProfessionalExperience = new ProfessionalExperience();
    }
    this.modalService.open(content)
      .result
      .then((resultModal => {
        if (resultModal === 'save') {
          if (editar) {
            this.updateProfessionalExperience();
          } else {
            this.createProfessionalExperience();
          }
        }
      }), (resultCancel => {

      }));
  }

  getProfessionalExperiences(): void {
    this.postulanteService.getProfessionalExperiences(
      this.actual_page, this.records_per_page,
      this.userLogged.id, this.userLogged.api_token)
      .subscribe(
        response => {
          console.log('Courses');
          console.log(response['Courses']);
          this.professionalExperiences = response['professionalExperiences']['data'];
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

  createProfessionalExperience(): void {
    this.postulanteService.createProfessionalExperience(
      {'professionalExperience': this.selectedProfessionalExperience, 'user': this.userLogged}, this.userLogged.api_token)
      .subscribe(
        response => {
          this.getProfessionalExperiences();
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

  updateProfessionalExperience(): void {
    this.postulanteService.updateProfessionalExperience(
      {'professionalExperience': this.selectedProfessionalExperience},
      this.userLogged.api_token)
      .subscribe(
        response => {
          this.getProfessionalExperiences();
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

  deleteProfessionalExperience(professionalExperience: ProfessionalExperience): void {
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
        this.postulanteService.deleteProfessionalExperience(professionalExperience.id, this.userLogged.api_token).subscribe(
          response => {
            this.getProfessionalExperiences();
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

  validateCurrentWork() {
    if (!this.current_work) {
      this.selectedProfessionalExperience.finish_date = new Date();
      this.selectedProfessionalExperience.reason_leave = '';
    }
  }
}
