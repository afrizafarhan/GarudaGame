const AddThreadUseCaseTest = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread')
describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const useCasePayload = {
            title: 'Dicoding',
            body: 'Dicoding indonesia'
        };
        const expectedRecordedThread = new RecordedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body
        })

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve({
                title: useCasePayload.title,
                body: useCasePayload.body
            }))

        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        });

        const recordedThread = await getThreadUseCase.execute(useCasePayload);

        expect(recordedThread).toStrictEqual(expectedRecordedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body
        }))
    });
})
