const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this.container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.likeDislikeCommentHandler = this.likeDislikeCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const threadCommentUseCase = this.container.getInstance(AddThreadCommentUseCase.name);
    const data = {
      threadId: request.params.threadId,
      content: request.payload.content,
      userId: request.auth.credentials.id,
    };
    const { id, content, owner } = await threadCommentUseCase.execute(data);
    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id,
          content,
          owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteThreadComment = this.container.getInstance(DeleteThreadCommentUseCase.name);
    const payload = {
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      userId: request.auth.credentials.id,
    };
    await deleteThreadComment.execute(payload);
    return h.response({
      status: 'success',
    });
  }

  async likeDislikeCommentHandler(request, h) {
    const likeDislikeComment = this.container.getInstance(LikeCommentUseCase.name);
    const payload = {
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      userId: request.auth.credentials.id,
    };
    await likeDislikeComment.execute(payload);
    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsHandler;
