class DeleteThreadCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute({ commentId, userId, threadId }) {
    await this.threadRepository.verifyAvailabilityThreadById(threadId);
    await this.commentRepository
      .verifyAvailabilityCommentByIdAndThreadId(commentId, threadId);
    await this.commentRepository.verifyOwnerCommentByIdAndUserId(commentId, userId);
    return this.commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
