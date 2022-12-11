class DeleteThreadCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute({ commentId, userId, threadId }) {
    const { rowCount: thread } = await this.threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    const { rowCount, rows: data } = await this.commentRepository
      .getCommentByIdAndThreadId(commentId, threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    }
    const { id, user_id: userIdThread } = data[0];
    if (userId !== userIdThread) {
      throw new Error('DELETE_THREAD_COMMENT.ACCESS_FORBIDEN');
    }
    return this.commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteThreadCommentUseCase;
