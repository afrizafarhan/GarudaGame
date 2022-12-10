const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(threadId, withComment = false) {
    const { rowCount, rows: data } = await this.threadRepository.getThreadById(threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    let comments;
    if (withComment) {
      comments = (await this.threadRepository.getThreadCommentsByThreadId(threadId)).rows;
    }
    const {
      id,
      title,
      body,
      username,
      user_id: userId,
      created_at: createdAt,
    } = data[0];
    const payload = {
      id,
      title,
      body,
      username,
      user_id: userId,
      created_at: new Date(createdAt).toISOString(),
    };
    if (comments) {
      payload.comments = comments;
    }
    return new DetailThread(payload);
  }
}

module.exports = GetThreadUseCase;
