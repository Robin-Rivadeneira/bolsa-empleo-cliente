import {Component, OnInit} from '@angular/core';
import {PostulanteService} from '../../services/postulante.service';
import swal from 'sweetalert2';
import {catalogos} from '../../../environments/catalogos';
import {Professional} from '../../models/professional';
import {User} from '../../models/user';

@Component({
  selector: 'app-hoja-vida',
  templateUrl: './hoja-vida.component.html',
  styleUrls: ['./hoja-vida.component.css']
})
export class HojaVidaComponent implements OnInit {
  postulantes = [];
  professional: Professional;
  userLogged: User;
  messages: any;

  constructor(private postulanteService: PostulanteService) {
  }

  ngOnInit() {
    this.messages = catalogos.messages;
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.getProfessional();
  }

  getProfessional(): void {
    this.postulanteService.getProfessional(this.userLogged.id, this.userLogged.api_token).subscribe(
      response => {
        this.professional = response['professional'];
        if (this.professional.about_me == null || this.professional.about_me === '' || !this.professional.academic_formations) {
          swal({
            position: this.messages['getProfesional401']['position'],
            type: this.messages['getProfesional401']['type'],
            title: this.messages['getProfesional401']['title'],
            text: this.messages['getProfesional401']['text'],
            showConfirmButton: this.messages['getProfesional401']['showConfirmButton'],
            backdrop: this.messages['getProfesional401']['backdrop']
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
      });
  }

}
