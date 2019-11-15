import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        price: Sequelize.NUMERIC,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { as: 'student', foreignKey: 'student_id' });
    this.belongsTo(models.Plan, { as: 'plan', foreignKey: 'plan_id' });
  }
}
export default Enrollment;
