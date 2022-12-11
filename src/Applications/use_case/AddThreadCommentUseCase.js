const AddComment = require('../../Domains/comments/entities/AddComment');

class AddThreadCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { rowCount } = await this.threadRepository.getThreadById(useCasePayload.threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    const addComment = new AddComment(useCasePayload);
    return this.commentRepository.addComment(addComment);
  }
}

module.exports = AddThreadCommentUseCase;
