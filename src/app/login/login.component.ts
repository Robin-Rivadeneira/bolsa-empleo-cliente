import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../router.animations';
import {Router} from '@angular/router';

import swal from 'sweetalert2';
import {environment} from '../../environments/environment';
import {RegisterService} from '../services/register.service';
import {User} from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  user: User;
  mostrarMensajeError = false;
  isLoading = false;
  srcFoto: string;

  constructor(public _router: Router, private registerService: RegisterService) {
  }

  ngOnInit() {
    this.user = new User();
  }

  login() {
    this.isLoading = true;
    const data = {'user': this.user};
    this.registerService.login(data).subscribe(
      response => {
        sessionStorage.setItem('user_logged', JSON.stringify(response));
        const userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
        if (userLogged && userLogged.role.toString() === '1') {
          location.replace('empresas');
        } else if (userLogged && userLogged.role.toString() === '2') {
          location.replace('postulantes');
        }

        this.isLoading = false;

      },
      error => {
        console.log(error);
        if (error.status == 0) {
          swal({
            position: 'center',
            type: 'error',
            title: 'Error en la conexión',
            text: 'Vuelva a intentar',
            showConfirmButton: true
          });
        }
        this.isLoading = false;
        if (error.status === 401) {
          swal({
            position: 'center',
            type: 'error',
            title: 'Usuario y/o Contraseña incorrectas',
            text: 'Vuelva a intentar',
            showConfirmButton: true
          });
        }
        if (error.valueOf().error.errorInfo[0] === '23505') {
          swal({
            position: 'center',
            type: 'error',
            title: 'El usuario ya se encuentra registrado',
            text: 'Verifique la identificación y/o correo electrónico',
            showConfirmButton: true
          });
        }

      }
    );
  }
}
