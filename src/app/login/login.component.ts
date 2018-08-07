import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../router.animations';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };
  usuario: firebase.User;
  mostrarMensajeError = false;
  isLoading = true;

  constructor(public router: Router, public authService: AuthService) {
  }

  ngOnInit() {
  }

  signInWithEmail() {
    this.authService.signInRegular(this.user.email, this.user.password)
      .then((res) => {

      })
      .catch((err) => {
        swal({
          position: 'center',
          type: 'warning',
          title: 'Usuario y/o Contraseña Incorrectos',
          text: 'Se produjo un error al validar sus credenciales',
          showConfirmButton: false,
          timer: 3000
        });
        console.log('error: ' + err);
      });
  }
}
