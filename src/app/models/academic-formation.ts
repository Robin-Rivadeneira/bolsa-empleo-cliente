export class AcademicFormation {
  id: number;
  professional_id: number;
  institution: string;
  career: string;
  professional_degree: string;
  registration_date: Date;
  senescyt_code: string;
  state: string;
  has_titling: boolean;
  file: File;

  constructor() {
    this.institution = '';
    this.career = '';
    this.professional_degree = '';
    this.senescyt_code = '';
    this.registration_date = null;
    this.has_titling = false;
    this.file = null;
  }
}
