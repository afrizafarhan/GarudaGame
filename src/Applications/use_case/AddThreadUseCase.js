const AddThread = require('../../Domains/threads/entities/AddThread')
class AddThreadUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload) {
        const addThread = new AddThread(useCasePayload);
        await this._threadRepository.addThread(addThread)
    }
}

module.exports = AddThreadUseCase;
