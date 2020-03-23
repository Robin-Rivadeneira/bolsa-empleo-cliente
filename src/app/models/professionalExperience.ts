export class ProfessionalExperience {
  id: number;
  employer: string;
  position: string;
  job_description: string;
  start_date: Date;
  finish_date: Date;
  reason_leave: string;
  current_work: boolean;
  state: string;

  constructor() {
    this.current_work = false;
    this.position = '';
    this.job_description = '';
    this.reason_leave = '';
  }
}
