import * as Yup from 'yup';
import Plain from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plain.findAll();
    return res.json(plans);
  }

  async store(req, res) {
    // Validação Schema Yup
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number().required(),
      duration: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { title, price, duration } = req.body;
    // Outras Validações

    // Gravação e retorno
    const plain = await Plain.create({
      title,
      price,
      duration
    });

    return res.json(plain);
  }

  async update(req, res) {
    // Validação Schema Yup
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number().required(),
      duration: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Outras Validações
    const plain = await Plain.findByPk(req.params.id);

    if (!plain) {
      return res.status(400).json({ error: 'Plain already exists' });
    }

    // Gravação e retorno
    const { id, title, price, duration } = await plain.update(req.body);

    return res.json({
      id,
      title,
      price,
      duration
    });
  }

  async delete(req, res) {
    // Outras Validações
    const plain = await Plain.findByPk(req.params.id);

    if (!plain) {
      return res.status(400).json({ error: 'Plain already exists' });
    }
    await plain.destroy();
    return res.status(200).json({ error: 'Success!' });
  }
}

export default new PlanController();
