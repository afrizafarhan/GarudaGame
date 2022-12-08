const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const RecordedThread = require('../../Domains/threads/entities/RecordedThread');
const RecordedThreadComment = require('../../Domains/threads/entities/RecordedThreadComment');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(recordThread) {
    const { title, body, userId } = recordThread;
    const id = `thread-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, title, body, userId],
    };
    const result = await this.pool.query(query);
    return new RecordedThread({
      id: result.rows[0].id, title: result.rows[0].title, owner: result.rows[0].user_id,
    });
  }

  async addThreadComment(recordThreadComment) {
    const { content, threadId, userId } = recordThreadComment;
    const id = `comment-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, threadId, userId],
    };

    const result = await this.pool.query(query);
    return new RecordedThreadComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    return this.pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;
