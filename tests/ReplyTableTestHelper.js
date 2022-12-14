/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'Dicoding',
    commentId = 'comment-123',
    userId = 'user-123',
    date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies(id, content, comment_id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING created_at',
      values: [id, content, commentId, userId, date, date],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies WHERE 1 = 1');
  },
};

module.exports = ReplyTableTestHelper;
