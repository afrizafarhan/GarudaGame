/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'comment-123',
    content = 'Dicoding',
    threadId = 'thread-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4)',
      values: [id, content, threadId, userId],
    };

    await pool.query(query);
  },

  async findThreadCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1 = 1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
