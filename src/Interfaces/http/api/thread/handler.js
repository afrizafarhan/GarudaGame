const ThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const data = {
            title: request.payload.title,
            body: request.payload.body,
            userId: request.auth.credentials.id
        }
        const { id, title, owner } = await threadUseCase.execute(data);
        const response = h.response({
            status: 'success',
            data: {
                addedThread: {
                    id,
                    title,
                    owner
                }
            }
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;
