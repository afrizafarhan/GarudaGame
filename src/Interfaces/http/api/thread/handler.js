const ThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this.container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this.container.getInstance(ThreadUseCase.name);
    const data = {
      title: request.payload.title,
      body: request.payload.body,
      userId: request.auth.credentials.id,
    };
    const { id, title, owner } = await threadUseCase.execute(data);
    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id,
          title,
          owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
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

  async deleteThreadCommentHandler(request, h) {
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

  async getThreadByIdHandler(request, h) {
    const getThread = this.container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;
    const data = await getThread.execute(threadId, true);
    return h.response({
      status: 'success',
      data: {
        thread: data,
      },
    });
  }
}

module.exports = ThreadsHandler;
