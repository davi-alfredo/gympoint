import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'nome']
        }
      ]
    });

    return res.json({ checkins });
  }

  async store(req, res) {
    const student_id = req.params.id;
    // Verificar se o Student existe
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists' });
    }
    const serchDate = Number(new Date());
    const { count } = await Checkin.findAndCountAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [startOfDay(subDays(serchDate, 7)), endOfDay(serchDate)]
        }
      }
    });

    if (count >= 5) {
      return res.status(400).json({
        error: 'The number of hits in the last seven days has been exceeded'
      });
    }

    const checkin = await Checkin.create({
      student_id
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
