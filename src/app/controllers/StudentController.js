import * as Yup from 'yup';
import Student from '../models/Student';

class StudenController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email }
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Estudante já existe' });
    }

    const { id, nome, email, idade, peso, altura } = await Student.create(
      req.body
    );
    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const studentExistis = await Student.findOne({
      where: { email: req.body.email }
    });

    if (!studentExistis) {
      return res.status(400).json({ error: 'Estudante não encontrado' });
    }

    const { id, nome, email, idade, peso, altura } = await Student.updade(
      req.body
    );

    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura
    });
  }
}
export default new StudenController();
