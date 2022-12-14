const AddComment = require('../../Domains/comments/entities/AddComment');

class AddThreadCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this.threadRepository.getThreadById(useCasePayload.threadId);
    const addComment = new AddComment(useCasePayload);
    return this.commentRepository.addComment(addComment);
  }
}

module.exports = AddThreadCommentUseCase;
