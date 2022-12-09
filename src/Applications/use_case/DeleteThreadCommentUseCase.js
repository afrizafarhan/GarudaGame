class DeleteThreadCommentUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute({ commentId, userId, threadId }) {
    const { rowCount, rows: data } = await this.threadRepository
      .getThreadCommentById(commentId, threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD_COMMENT.NOT_THREAD_COMMENT_FOUND');
    }
    const { id, user_id: userIdThread } = data[0];
    if (userId !== userIdThread) {
      throw new Error('DELETE_THREAD_COMMENT.ACCESS_FORBIDEN');
    }
    return this.threadRepository.deleteThreadCommentById(id);
  }
}

module.exports = DeleteThreadCommentUseCase;
