import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostulanteService} from '../../services/postulante.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import {Professional} from '../../models/professional';
import {User} from '../../models/user';
import swal from 'sweetalert2';
import {AcademicFormation} from '../../models/academic-formation';
import {Course} from '../../models/course';
import {Language} from '../../models/language';
import {ProfessionalExperience} from '../../models/professionalExperience';
import {ProfessionalReference} from '../../models/professionalReference';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {
  userLogged: User;
  academicFormations: Array<AcademicFormation>;
  courses: Array<Course>;
  languages: Array<Language>;
  professionalExperiences: Array<ProfessionalExperience>;
  professionalReferences: Array<ProfessionalReference>;

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  curriculum: Professional;
  @ViewChild('encabezadoHojaVida') encabezadoHojaVida: ElementRef;
  @ViewChild('cuerpoHojaVida') cuerpoHojaVida: ElementRef;
  @ViewChild('pieHojaVida') pieHojaVida: ElementRef;


  constructor(
    public postulanteService: PostulanteService) {
  }

  ngOnInit() {
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.curriculum = new Professional();
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    let month = fechaActual.getMonth();
    month += 1;
    const day = fechaActual.getDate();
    this.getProfessional();
  }

  getProfessional(): void {
    this.postulanteService.getProfessional(this.userLogged.id, this.userLogged.api_token).subscribe(
      response => {
        this.curriculum = response['professional'];
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

  imprimir2() {
    html2canvas(this.encabezadoHojaVida.nativeElement).then(canvasEncabezado => {
      const encabezadoHojaDatosImg = canvasEncabezado.toDataURL('image/png');
      html2canvas(this.cuerpoHojaVida.nativeElement).then(canvasCuerpo => {
        const cuerpoHojaDatosImg = canvasCuerpo.toDataURL('image/png');
        html2canvas(this.pieHojaVida.nativeElement).then(canvasPie => {
          const pieHojaDatosImg = canvasPie.toDataURL('image/png');
          const doc = new jsPDF();
          doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 7);
          doc.addImage(cuerpoHojaDatosImg, 'PNG', 30, 17, 160, 265);
          doc.addImage(pieHojaDatosImg, 'PNG', 10, 288, 190, 7);

          doc.save('CV_' + this.curriculum.identity + '.pdf');
        });
      });
    });
  }

  imprimir() {
    return xepOnline.Formatter.Format('curriculum', {
      render: 'download',
      filename: 'CV - ' + this.curriculum.first_name.toLocaleUpperCase() + ' (' + this.curriculum.identity + ')'
    });
  }

}
