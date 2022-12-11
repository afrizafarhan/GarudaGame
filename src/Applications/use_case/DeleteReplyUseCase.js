class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(payload) {
    const thread = await this.threadRepository.getThreadById(payload.threadId);
    if (!thread.rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    const comment = await this.commentRepository
      .getCommentByIdAndThreadId(payload.commentId, payload.threadId);
    if (!comment.rowCount) {
      throw new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    }
    const reply = await this.replyRepository
      .getReplyByIdAndCommentId(payload.replyId, payload.commentId);
    if (!reply.rowCount) {
      throw new Error('GET_REPLY.NO_REPLY_FOUND');
    }
    if (reply.rows[0].user_id !== payload.userId) {
      throw new Error('DELETE_REPLY.ACCESS_FORBIDEN');
    }
    return this.replyRepository.deleteReplyById(payload.replyId);
  }
}

module.exports = DeleteReplyUseCase;
