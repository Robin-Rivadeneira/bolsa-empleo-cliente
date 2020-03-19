import {Component, OnInit, ViewChild} from '@angular/core';
import {EmpresaService} from '../../services/empresa.service';
import {OfertaService} from '../../services/oferta.service';
import {PostulanteService} from '../../services/postulante.service';
import swal from 'sweetalert2';
import {User} from '../../models/user';
import {Professional} from '../../models/professional';
import {catalogos} from '../../../environments/catalogos';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  contadorEmpresas: number;
  contadorPostulantes: number;
  contadorOfertas: number;
  userLogged: User;
  professional: Professional;
  messages: any;

  constructor(
    public empresaService: EmpresaService,
    public ofertaService: OfertaService,
    public postulanteService: PostulanteService) {
  }


  ngOnInit() {
    if (sessionStorage.getItem('user_logged')) {
      this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    } else {
      this.userLogged = new User();
    }
    this.messages = catalogos.messages;
    this.contadorEmpresas = 0;
    this.contadorPostulantes = 0;
    this.contadorOfertas = 0;
    this.contarEmpresas();
    this.contarPostulantes();
    this.contarOfertas();
    if (this.userLogged && this.userLogged.role == '1') {
      this.getProfessional();
    }
  }

  contarEmpresas() {
    this.empresaService.getTotalCompanies().subscribe(
      response => {
        this.contadorEmpresas = response['totalCompanies'];
      });
  }

  contarPostulantes() {
    this.postulanteService.getTotalProfessionals().subscribe(
      response => {
        this.contadorPostulantes = response['totalProfessionals'];
      });

  }

  contarOfertas() {
    this.ofertaService.getTotalOffers().subscribe(
      response => {
        this.contadorOfertas = response['totalOffers'];
      });
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
