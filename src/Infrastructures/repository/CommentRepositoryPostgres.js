const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(payload) {
    const { content, threadId, userId } = payload;
    const id = `comment-${this.idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO thread_comments(id, content, thread_id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id as owner',
      values: [id, content, threadId, userId, date, date],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyAvailabilityCommentByIdAndThreadId(commentId, threadId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT tc.id, content, tc.created_at as date, username, is_delete, tc.likes as "likeCount" FROM thread_comments tc JOIN users u ON u.id = tc.user_id WHERE tc.thread_id = $1 ORDER BY created_at ASC',
      values: [threadId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = true WHERE id = $1 RETURNING id',
      values: [id],
    };
    await this.pool.query(query);
  }

  async verifyOwnerCommentByIdAndUserId(commentId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new Error('VERIFY_COMMENT_OWNER.ACCESS_FORBIDEN');
    }
  }

  async incrementLikeCommentById(commentId) {
    const query = {
      text: 'UPDATE thread_comments SET likes = likes + 1 WHERE id = $1',
      values: [commentId],
    };
    await this.pool.query(query);
  }

  async decrementLikeCommentById(commentId) {
    const query = {
      text: 'UPDATE thread_comments SET likes = likes - 1 WHERE id = $1',
      values: [commentId],
    };
    await this.pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
