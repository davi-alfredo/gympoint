import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    await Mail.sendMail({
      to: `${student.nome} <${student.email}>`,
      subject: 'Matrícula Realizada',
      template: 'enrollments',
      context: {
        student: student.nome,
        plan: plan.title,
        start_date: format(
          parseISO(enrollment.start_date),
          "dd 'de' MMMM' de' yyyy",
          {
            locale: pt
          }
        ),
        end_date: format(
          parseISO(enrollment.end_date),
          "dd 'de' MMMM' de' yyyy",
          {
            locale: pt
          }
        ),
        price: enrollment.price
      }
    });
  }
}
export default new EnrollmentMail();
