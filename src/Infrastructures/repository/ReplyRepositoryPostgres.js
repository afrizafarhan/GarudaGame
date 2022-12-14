const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addReply(payload) {
    const { content, commentId, userId } = payload;
    const id = `reply-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4) RETURNING id, content, user_id as owner',
      values: [id, content, commentId, userId],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyReplyByIdAndCommentId(replyId, commentId) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new Error('GET_REPLY.NO_REPLY_FOUND');
    }
  }

  async getReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT r.id, comment_id as "commentId", u.username, r.created_at as date, r.content, r.is_delete FROM thread_comment_replies as r JOIN thread_comments as c ON c.id = r.comment_id JOIN users u ON u.id = r.user_id WHERE comment_id = ANY($1::varchar[]) ORDER BY r.created_at ASC',
      values: [commentId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE thread_comment_replies SET is_delete = true WHERE id = $1 RETURNING id, is_delete',
      values: [id],
    };
    await this.pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
