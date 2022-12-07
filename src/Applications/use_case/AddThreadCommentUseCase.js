const AddThreadComment = require('../../Domains/threads/entities/AddThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThreadComment = new AddThreadComment(useCasePayload);
    return this.threadRepository.addThreadComment(addThreadComment);
  }
}

module.exports = AddThreadCommentUseCase;
