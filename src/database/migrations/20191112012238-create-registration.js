module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('enrollments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        REFERENCES: { MODEL: 'students', key: 'id' },
        onUpload: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false
      },
      plan_id: {
        type: Sequelize.INTEGER,
        REFERENCES: { MODEL: 'plans', key: 'id' },
        onUpload: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false
      },
      price: {
        type: Sequelize.NUMERIC,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('enrollments');
  }
};
