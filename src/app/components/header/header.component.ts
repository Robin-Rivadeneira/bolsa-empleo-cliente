import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert2';
import {User} from '../../models/user';
import {RegisterService} from '../../services/register.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  contadorEmpresas: number;
  contadorPostulantes: number;
  contadorOfertas: number;
  totalOfertas: number;
  userLogged: User;

  constructor(public router: Router,
              public _router: Router,
              public registerService: RegisterService) {
  }

  ngOnInit() {
    this.userLogged = new User();
    if (sessionStorage.getItem('user_logged') != null) {
      this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    }
  }

  logout() {
    const data = {'user': this.userLogged};
    console.log(data);
    this.registerService.logout(data).subscribe(
      response => {
        sessionStorage.clear();
        location.replace('/login');
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

      }
    );
  }
}
