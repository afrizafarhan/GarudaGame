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
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, user_id as owner',
      values: [id, content, threadId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };
    return this.pool.query(query);
  }

  async getCommentByIdAndThreadId(commentId, threadId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };
    return this.pool.query(query);
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT tc.id, content, tc.created_at as date, username, is_delete FROM thread_comments tc JOIN users u ON u.id = tc.user_id WHERE tc.thread_id = $1 ORDER BY created_at ASC',
      values: [threadId],
    };
    return this.pool.query(query);
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = true WHERE id = $1 RETURNING id',
      values: [id],
    };
    return this.pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
