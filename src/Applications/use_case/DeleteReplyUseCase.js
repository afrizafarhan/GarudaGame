class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute({
    threadId,
    userId,
    commentId,
    replyId,
  }) {
    await this.threadRepository.verifyAvailabilityThreadById(threadId);
    await this.commentRepository
      .verifyAvailabilityCommentByIdAndThreadId(commentId, threadId);
    await this.replyRepository
      .verifyReplyByIdAndCommentId(replyId, commentId);
    await this.replyRepository
      .verifyOwnerReplyByIdAndUserId(replyId, userId);
    return this.replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
