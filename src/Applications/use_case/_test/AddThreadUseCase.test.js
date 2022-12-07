const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RecordedThread = require('../../../Domains/threads/entities/RecordedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Dicoding',
      body: 'Dicoding indonesia',
      userId: 'user-123',
    };
    const expectedRecordedThread = new RecordedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new RecordedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      })));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const recordedThread = await getThreadUseCase.execute(useCasePayload);

    expect(recordedThread).toStrictEqual(expectedRecordedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      userId: useCasePayload.userId,
    }));
  });
});
