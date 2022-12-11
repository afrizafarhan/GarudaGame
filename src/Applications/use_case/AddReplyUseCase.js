const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this.replyRepository = replyRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(payload) {
    const addReply = new AddReply(payload);
    const thread = await this.threadRepository.getThreadById(addReply.threadId);
    if (!thread.rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    const comment = await this.commentRepository
      .getCommentByIdAndThreadId(addReply.commentId, addReply.threadId);
    if (!comment.rowCount) {
      throw new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    }
    return this.replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
