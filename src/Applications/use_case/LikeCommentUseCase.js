class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.likeRepository = likeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this.threadRepository.verifyAvailabilityThreadById(threadId);
    await this.commentRepository.verifyAvailabilityCommentByIdAndThreadId(commentId, threadId);
    if (!await this.likeRepository.verifyUserLikeComment(commentId, userId)) {
      await this.likeRepository.addUserLikeComment(commentId, userId);
    } else {
      await this.likeRepository.deleteUserLikeComment(commentId, userId);
    }
  }
}

module.exports = LikeCommentUseCase;
