import {Component, OnInit, ViewChild} from '@angular/core';
import {EmpresaService} from '../../../services/empresa.service';
import swal from 'sweetalert2';
import {Company} from '../../../models/company';
import {User} from '../../../models/user';

@Component({
  selector: 'app-informacion-empresa',
  templateUrl: './informacion-empresa.component.html',
  styleUrls: ['./informacion-empresa.component.css']
})
export class InformacionEmpresaComponent implements OnInit {
  srcFoto: string;
  company: Company;
  userLogged: User;

  constructor(public empresaService: EmpresaService) {
  }

  ngOnInit() {
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.company = new Company();
    this.getCompany();
  }

  getCompany(): void {
    this.empresaService.getCompany(this.userLogged.id, this.userLogged.api_token).subscribe(
      response => {
        this.company = response['company'];
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

  updateCompany(): void {
    this.empresaService.updateCompany({'company': this.company}, this.userLogged.api_token).subscribe(
      response => {
        this.getCompany();
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
        }
      });
  }

}
