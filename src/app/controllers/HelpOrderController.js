import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const help_order = await HelpOrder.findAll({
      where: { student_id: req.params.id }
    });

    return res.json({ help_order });
  }

  async store(req, res) {
    const student_id = req.params.id;
    const { question } = req.body;

    // Verificar se o Student existe
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const help_order = await HelpOrder.create({
      student_id,
      question
    });

    return res.json(help_order);
  }
}

export default new HelpOrderController();
