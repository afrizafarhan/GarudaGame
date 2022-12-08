const ThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this.container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
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
    const getThread = this.container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;
    await getThread.execute(threadId);
    const data = {
      threadId,
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
}

module.exports = ThreadsHandler;
