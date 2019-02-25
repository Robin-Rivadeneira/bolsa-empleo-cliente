import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {ProfessionalService} from '../services/professional.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  userName: string;
  validUser: boolean;
  email: string;

  constructor(private postulanteService: ProfessionalService, private _router: Router) {
  }

  ngOnInit() {
    this.validUser = false;
  }

  validateUser() {
    if (this.userName) {
      this.postulanteService.validateUserName(this.userName)
        .subscribe(
          response => {
            if (response['email']) {
              this.validUser = true;
            this.email = response['email'].toString().substring(0, 4);
            this.email += '******';
            this.email += response['email'].toString()
                .substring(response['email'].toString().indexOf('@'), response['email'].toString().length);
            } else {
              this.validUser = false;
              this.email = null;
              swal({
                  position: 'center',
                  type: 'warning',
                  title: 'Este usuario no se encuentra registrado',
                  text: 'Vuelve a intentar',
                  showConfirmButton: true,
                  timer: 3000
                }
              );
            }
          },
          error => {

          });
    }
  }

  reiniciar() {
    this._router.navigate(['login']);
  }

  cancel() {
    this._router.navigate(['login']);
  }
}
