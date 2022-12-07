const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');
const RecordedCommentThread = require('../../../Domains/threads/entities/RecordedThreadComment');
const AddThreadComment = require('../../../Domains/threads/entities/AddThreadComment');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add comment thread action correctly', async () => {
    const useCasePayload = {
      content: 'dicoding',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const expectedRecordedCommentThread = new RecordedCommentThread({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new RecordedCommentThread({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      })));

    const getThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    const recordedCommentThread = await getThreadCommentUseCase.execute(useCasePayload);
    expect(recordedCommentThread).toStrictEqual(expectedRecordedCommentThread);
    expect(mockThreadRepository.addThreadComment).toBeCalledWith(new AddThreadComment({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    }));
  });
});
