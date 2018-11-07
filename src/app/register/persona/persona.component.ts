import {Component, OnInit} from '@angular/core';
import {Postulante} from '../../models/postulante';
import {FirebaseBDDService} from './../../services/firebase-bdd.service';
import {PostulanteService} from '../../services/postulante.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {catalogos} from '../../../environments/catalogos';
import {RegisterService} from '../../services/register.service';
import {Company} from '../../models/company';
import {User} from '../../models/user';
import {Professional} from '../../models/professional';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  professional: Professional;
  user: User;
  password: string;
  password_confirmation: string;
  nacionalidades: Array<any>;
  estadosCiviles: Array<any>;
  sexos: Array<any>;
  correoValido: boolean;
  claveValida: boolean;
  claveConfirmacionValida: boolean;

  constructor(
    private registerService: RegisterService,
    private postulanteService: PostulanteService,
    private firebaseBDDService: FirebaseBDDService,
    public authService: AuthService,
    private _router: Router) {
  }

  ngOnInit() {
    this.correoValido = false;
    this.claveValida = false;
    this.claveConfirmacionValida = false;
    this.professional = new Professional();
    this.user = new User();
    this.nacionalidades = catalogos.nacionalidades;
    this.estadosCiviles = catalogos.estadosCiviles;
    this.sexos = catalogos.sexos;
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

  validarCorreoElectronico(correoElectronico: string) {
    const expreg = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    if (expreg.test(correoElectronico)) {
      this.correoValido = true;
      return true;
    } else {
      this.correoValido = false;
      return false;
    }

  }

  validarFormulario(dataUser: User): string {
    let errores = '';
    if (this.password.length < 6 || this.password_confirmation.length < 6) {
      errores += 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!this.validarCorreoElectronico(dataUser.email)) {
      if (errores.length > 0) {
        errores += ' - ';
      }
      errores += 'Correo electrónico no válido';
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

  register() {
    const validacion = this.validarFormulario(this.user);
    if (validacion === '') {
      this.professional.email = this.user.email;
      this.user.name = this.professional.first_name + ' ' + this.professional.last_name;
      this.user.user_name = this.professional.identity;
      this.user.password = this.password;
      const data = {'professional': this.professional, 'user': this.user};
      this.registerService.createProfessionalUser(data).subscribe(
        response => {
          swal({
              position: 'center',
              type: 'success',
              title: 'Registro de Profesional',
              text: 'Registro Satisfactorio',
              showConfirmButton: false,
              timer: 2000
            }
          );
          sessionStorage.setItem('user_logged', JSON.stringify(response));
          location.replace('/empresas');
        },
        error => {
          if (error.valueOf().error.errorInfo[0] === '23505') {
            swal({
              position: 'center',
              type: 'error',
              title: 'El usuario ya se encuentra registrado',
              text: 'Verifique la identificación y/o correo electrónico',
              showConfirmButton: true
            });
          }
          if (error.valueOf().error.errorInfo[0] === '22007') {
            swal({
              position: 'center',
              type: 'error',
              title: 'El formato de la fecha no es el correcto',
              text: '',
              showConfirmButton: true
            });
          }
        }
      );
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
}
