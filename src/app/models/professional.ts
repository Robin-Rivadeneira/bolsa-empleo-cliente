import {AcademicFormation} from './academic-formation';

export class Professional {
  id: number;
  avatar: string;
  identity: string;
  first_name: string;
  email: string;
  last_name: string;
  nationality: string;
  civil_state: string;
  birthdate: Date;
  gender: string;
  phone: string;
  address: string;
  about_me: string;
  state: string;
  academic_formations: Array<AcademicFormation>;
  academics_formations: Array<AcademicFormation>;
  professional_degree: string;
  career: string;

  constructor() {
    // this.academic_formations = new AcademicFormation();
    this.academic_formations = new Array<AcademicFormation>();
    this.academics_formations = new Array<AcademicFormation>();
    this.identity = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.nationality = '';
    this.birthdate = new Date();
    this.civil_state = '';
    this.gender = '';
    this.phone = '';
    this.address = '';
    this.about_me = '';
  }
}
