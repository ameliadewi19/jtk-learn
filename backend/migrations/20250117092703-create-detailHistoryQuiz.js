'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detailHistoryQuiz', {
      id_detail_history_quiz: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_history_quiz: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'historyQuiz',
          key: 'id_history_quiz',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_pertanyaan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pertanyaan',
          key: 'id_pertanyaan',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_jawaban: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'jawaban',
          key: 'id_jawaban',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      jawaban_text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('benar', 'salah'),
        allowNull: false,
        defaultValue: 'salah',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION calculate_status_detail_history_quiz()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.id_jawaban IS NOT NULL THEN
          -- Check if the selected jawaban is correct
          IF (SELECT status_jawaban FROM jawaban WHERE id_jawaban = NEW.id_jawaban) = 'benar' THEN
            NEW.status = 'benar';
          ELSE
            NEW.status = 'salah';
          END IF;
        ELSIF NEW.jawaban_text IS NOT NULL THEN
          -- If jawaban_text is provided, check if it is correct
          IF (SELECT konten_jawaban FROM jawaban WHERE konten_jawaban = NEW.jawaban_text AND status_jawaban = 'benar') IS NOT NULL THEN
            NEW.status = 'benar';
          ELSE
              NEW.status = 'salah';
          END IF;
        ELSE
          -- If neither id_jawaban nor jawaban_text is provided, set status to 'salah'
          NEW.status = 'salah';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER calculate_status_detail_history_quiz_trigger
      BEFORE INSERT OR UPDATE ON "detailHistoryQuiz"
      FOR EACH ROW
      EXECUTE FUNCTION calculate_status_detail_history_quiz();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS calculate_status_detail_history_quiz_trigger ON "detailHistoryQuiz"');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS calculate_status_detail_history_quiz');
    await queryInterface.dropTable('detailHistoryQuiz');
  }
};
