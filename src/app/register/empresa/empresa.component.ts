import {Component, OnInit} from '@angular/core';
import {Company} from '../../models/company';
import {FirebaseBDDService} from '../../services/firebase-bdd.service';
import {AuthService} from '../../services/auth.service';
import {EmpresaService} from '../../services/empresa.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {Postulante} from '../../models/postulante';
import {RegisterService} from '../../services/register.service';
import {User} from '../../models/user';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  company: Company;
  user: User;
  password: string;
  passwordConfirmation: string;
  correoValido: boolean;
  claveValida: boolean;
  claveConfirmacionValida: boolean;
  paginaWebValida: boolean;

  constructor(private registerService: RegisterService,
              private firebaseBDDService: FirebaseBDDService,
              public authService: AuthService,
              private _router: Router) {
  }

  ngOnInit() {
    this.claveValida = false;
    this.claveConfirmacionValida = false;
    this.paginaWebValida = false;
    this.company = new Company();
    this.user = new User();
  }

  validarClave(): boolean {
    if (this.passwordConfirmation == null || this.passwordConfirmation.length === 0) {
      if (this.password.length < 6) {
        this.claveValida = false;
      } else {
        this.claveValida = true;
      }
    } else {
      if (this.password === this.passwordConfirmation && this.password.length >= 6) {
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
      if (this.passwordConfirmation.length < 6) {
        this.claveConfirmacionValida = false;
      } else {
        this.claveConfirmacionValida = true;
      }
    } else {
      if (this.password === this.passwordConfirmation && this.password.length >= 6) {
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

  validarPaginaWeb(paginaWeb: string) {
    const expreg = /^[_a-z0-9-]+(.[_a-z0-9-]+)+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    if (expreg.test(paginaWeb)) {
      this.paginaWebValida = true;
      return true;
    } else {
      this.paginaWebValida = false;
      return false;
    }

  }

  validarFormulario(dataUser: User): string {
    let errores = '';
    if (this.password.length < 6 || this.passwordConfirmation.length < 6) {
      errores += 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!this.validarCorreoElectronico(dataUser.email)) {
      if (errores.length > 0) {
        errores += ' - ';
      }
      errores += 'Correo electrónico no válido';
    }
    if (this.passwordConfirmation !== this.password) {
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
      this.company.trade_name = this.company.trade_name.toUpperCase();
      this.company.comercial_activity = this.company.comercial_activity.toUpperCase();
      this.company.email = this.user.email.toLowerCase();
      console.log('this.company.web_page');
      console.log(this.company.web_page.length);
      if (this.company.web_page.length !== 0) {
        this.company.web_page = this.company.web_page.toLowerCase();
      }
      this.company.address = this.company.address.toUpperCase();
      this.user.name = this.company.trade_name;
      this.user.user_name = this.company.identity;
      this.user.password = this.password;
      const data = {'company': this.company, 'user': this.user};

      this.registerService.createCompanyUser(data).subscribe(
        response => {
          swal({
              position: 'center',
              type: 'success',
              title: 'Registro de Empresa',
              text: 'Registro Satisfactorio',
              showConfirmButton: false,
              timer: 2000
            }
          );
          sessionStorage.setItem('user_logged', JSON.stringify(response));

          location.replace('/postulantes');
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
          } else {
            swal({
              position: 'center',
              type: 'error',
              title: 'Problemas con el servidor',
              text: 'Vuelve a intentar',
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
