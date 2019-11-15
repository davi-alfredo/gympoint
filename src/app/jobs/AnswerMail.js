import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { help_order } = data;

    await Mail.sendMail({
      to: `${help_order.student.nome} <${help_order.student.email}>`,
      subject: 'Answer',
      template: 'answers',
      context: {
        student: help_order.student.nome,
        question: help_order.question,
        answer: help_order.answer
      }
    });
  }
}
export default new AnswerMail();
