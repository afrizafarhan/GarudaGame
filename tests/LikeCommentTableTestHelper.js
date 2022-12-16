/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeCommentTableTestHelper = {
  async addLikeComment({
    commentId = 'comment-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_like_users VALUES($1, $2)',
      values: [commentId, userId],
    };
    await pool.query(query);
  },

  async findLikeCommentByCommentIdAndUserId(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_like_users WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_like_users WHERE 1 = 1');
  },
};

module.exports = LikeCommentTableTestHelper;
