class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.likeCommentRepository = likeCommentRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this.threadRepository.verifyAvailabilityThreadById(threadId);
    await this.commentRepository.verifyAvailabilityCommentByIdAndThreadId(commentId, threadId);
    const isAlreadyLike = await this.likeCommentRepository.verifyUserLikeComment(commentId, userId);
    if (isAlreadyLike) {
      await this.commentRepository.incrementLikeCommentById(commentId);
      await this.likeCommentRepository.addUserLikeComment(commentId, userId);
    } else {
      await this.commentRepository.decrementLikeCommentById(commentId);
      await this.likeCommentRepository.deleteUserLikeComment(commentId, userId);
    }
  }
}

module.exports = LikeCommentUseCase;
