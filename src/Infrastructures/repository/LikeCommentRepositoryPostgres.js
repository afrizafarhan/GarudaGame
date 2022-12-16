const LikeCommentRepository = require('../../Domains/likes/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async addUserLikeComment(commentId, userId) {
    const query = {
      text: 'INSERT INTO comment_like_users VALUES($1, $2) RETURNING comment_id as "commentId", user_id as "userId"',
      values: [commentId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteUserLikeComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_like_users WHERE comment_id = $1 AND user_id = $2 RETURNING comment_id as "commentId", user_id as "userId"',
      values: [commentId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyUserLikeComment(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_like_users WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this.pool.query(query);
    return !result.rowCount;
  }
}

module.exports = LikeCommentRepositoryPostgres;
