import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';
import Student from '../models/Student';

class AnswerController {
  async index(req, res) {
    const helporders = await HelpOrder.findAll({
      where: { answer_at: null }
    });

    return res.json({ helporders });
  }

  async update(req, res) {
    // Validação Schema Yup
    const schema = Yup.object().shape({
      answer: Yup.string().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { answer } = req.body;
    const { id } = req.params;
    const help_order = await HelpOrder.findByPk(id, {
      where: { answer_at: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'nome', 'email', 'idade', 'altura']
        }
      ]
    });

    // Verificar se o Help existe
    if (!help_order) {
      return res.status(400).json({ error: 'Help Order already exists' });
    }

    const help_order_update = await help_order.update({
      answer,
      answer_at: new Date()
    });

    help_order.answer = answer;

    await Queue.add(AnswerMail.key, {
      help_order
    });

    return res.json(help_order_update);
  }
}

export default new AnswerController();
