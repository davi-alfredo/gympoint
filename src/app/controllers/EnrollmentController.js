import * as Yup from 'yup';
import { setDay, parseISO } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'nome', 'email', 'idade', 'altura']
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price']
        }
      ]
    });
    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      studentId: Yup.number().required(),
      planId: Yup.number().required(),
      startDate: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      studentId: student_id,
      planId: plan_id,
      startDate: start_date
    } = req.body;
    // Verificar se o Student existe
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    // Verificar se o plan  existe
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    // Adicionar a data final do plano
    const end_date = setDay(parseISO(start_date), 30 * plan.duration);

    // adicionar o preco final
    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      price,
      start_date,
      end_date
    });

    // enrollment.student.nome = student.nome;

    await Queue.add(EnrollmentMail.key, {
      enrollment,
      student: {
        nome: student.nome,
        email: student.email
      },
      plan: {
        title: plan.title
      }
    });

    return res.json({ enrollment });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      studentId: Yup.number().required(),
      planId: Yup.number().required(),
      startDate: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const enrollmentId = req.params.id;

    const {
      studentId: student_id,
      planId: plan_id,
      startDate: start_date
    } = req.body;

    // Verificar se a  Matrícula existe
    const enrollment = await Enrollment.findByPk(enrollmentId);
    if (!enrollment) {
      return res.status(400).json({ error: 'Registration already exists' });
    }

    // Verificar se o Student existe
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    // Verificar se o plan  existe
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan already exists' });
    }
    enrollment.student_id = student.id;
    enrollment.plan_id = plan.id;

    // Adicionar a data final do plano
    enrollment.end_date = setDay(parseISO(start_date), 30 * plan.duration);

    // adicionar o preco final
    enrollment.price = plan.price * plan.duration;

    await enrollment.update(enrollment);

    return res.json(enrollment);
  }

  async delete(req, res) {
    // Outras Validações
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment already exists' });
    }
    await enrollment.destroy();
    return res.status(200).json({ status: 'Success!' });
  }
}
export default new EnrollmentController();
