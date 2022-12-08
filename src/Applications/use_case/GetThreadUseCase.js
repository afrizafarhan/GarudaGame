const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(threadId) {
    const { rowCount, rows: data } = await this.threadRepository.getThreadById(threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    const {
      id,
      title,
      body,
      user_id: userId,
      created_at: createdAt,
    } = data[0];
    return new DetailThread({
      id,
      title,
      body,
      user_id: userId,
      created_at: new Date(createdAt).toISOString(),
    });
  }
}

module.exports = GetThreadUseCase;
