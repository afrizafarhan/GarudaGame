const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(threadId, withComment = false) {
    const { rowCount, rows: data } = await this.threadRepository.getThreadById(threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    let comments;
    if (withComment) {
      comments = (await this.commentRepository.getCommentByThreadId(threadId))
        .rows.map((val) => ({
          id: val.id,
          username: val.username,
          date: val.date,
          content: val.is_delete ? '**komentar telah dihapus**' : val.content,
        }));
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
