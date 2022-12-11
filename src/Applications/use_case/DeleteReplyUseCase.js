class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(payload) {
    const thread = this.threadRepository.getThreadById(payload.threadId);
    if (!thread.rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
  }
}

module.exports = DeleteReplyUseCase;
