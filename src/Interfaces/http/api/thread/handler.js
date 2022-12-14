const ThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this.container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
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
