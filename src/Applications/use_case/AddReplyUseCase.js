const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this.replyRepository = replyRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(payload) {
    const addReply = new AddReply(payload);
    await this.threadRepository.verifyAvailabilityThreadById(addReply.threadId);
    await this.commentRepository
      .verifyAvailabilityCommentByIdAndThreadId(addReply.commentId, addReply.threadId);
    return this.replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
