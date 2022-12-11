const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this.container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const replyUseCase = this.container.getInstance(AddReplyUseCase.name);
    const payload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      content: request.payload.content,
      userId: request.auth.credentials.id,
    };
    const { id, content, owner } = (await replyUseCase.execute(payload)).rows[0];
    const response = h.response({
      status: 'success',
      data: {
        addedReply: {
          id,
          content,
          owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReply = this.container.getInstance(DeleteReplyUseCase.name);
    const payload = {
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      userId: request.auth.credentials.id,
      replyId: request.params.replyId,
    };
    await deleteReply.execute(payload);
    return h.response({
      status: 'success',
    });
  }
}

module.exports = ReplyHandler;
