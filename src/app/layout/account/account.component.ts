import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {catalogos} from '../../../environments/catalogos';
import {User} from '../../models/user';
import swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  messages: any;
  validPassword: boolean;
  user: User;
  confirmPassword;
  password: string;
  password_confirmation: string;
  claveValida: boolean;
  claveConfirmacionValida: boolean;

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.messages = catalogos.messages;
    this.user = new User();
    this.user = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.validPassword = false;
    this.claveValida = false;
    this.claveConfirmacionValida = false;
  }

  updatePassword() {
    const validacion = this.validarFormulario(this.user);
    if (validacion === '') {
      this.user.password = this.password;
      this.userService.updatePassword({'user': this.user}, this.user.api_token)
        .subscribe(
          response => {
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
    } else {
      swal({
        position: 'center',
        type: 'error',
        title: 'Formulario Incompleto',
        text: validacion,
        showConfirmButton: true
      });
    }
  }

  recoverPassword() {
    swal({
      position: 'center',
      type: 'question',
      title: '¿Está seguro de recuperar su contraseña?',
      text: 'Se le enviará un correo electrónico...',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="fa fa-key" aria-hidden="true"> Confirmar</i>',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: 'rgba(255, 0, 0,0.4)',
    }).then((result) => {
      if (result.value) {
        this.userService.recoverPassword(this.user, this.user.api_token).subscribe(
          response => {
            swal({
              position: 'center',
              type: 'success',
              title: 'Correo electrónico enviado...',
              text: '',
              timer: 3000,
              showConfirmButton: true,
              backdrop: 'rgba(0, 0, 255,0.4)',
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

  validarClave(): boolean {
    if (this.password_confirmation == null || this.password_confirmation.length === 0) {
      if (this.password.length < 6) {
        this.claveValida = false;
      } else {
        this.claveValida = true;
      }
    } else {
      if (this.password === this.password_confirmation && this.password.length >= 6) {
        this.claveValida = true;
        this.claveConfirmacionValida = true;
      } else {
        this.claveValida = false;
        this.claveConfirmacionValida = false;
      }
    }
    return this.claveValida;
  }

  validarClaveConfirmacion(): boolean {
    console.log(this.password);
    if (this.password == null || this.password.length === 0) {
      if (this.password_confirmation.length < 6) {
        this.claveConfirmacionValida = false;
      } else {
        this.claveConfirmacionValida = true;
      }
    } else {
      if (this.password === this.password_confirmation && this.password.length >= 6) {
        this.claveValida = true;
        this.claveConfirmacionValida = true;
      } else {
        this.claveValida = false;
        this.claveConfirmacionValida = false;
      }
    }
    return this.claveConfirmacionValida;
  }

  validarFormulario(dataUser: User): string {
    let errores = '';
    if (this.password.length < 6 || this.password_confirmation.length < 6) {
      errores += 'La contraseña debe tener al menos 6 caracteres';
    }

    if (this.password_confirmation !== this.password) {
      if (errores.length > 0) {
        errores += ' - ';
      }
      errores += 'Las contraseñas no coinciden';
    }
    if (dataUser.email.length > 0) {
      const correo = dataUser.email.split('', 1);
      console.log(correo);
    }
    return errores;
  }
}
