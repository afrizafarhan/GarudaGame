const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply comment action correctly', async () => {
    const useCasePayload = {
      content: 'dicoding',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const expectedRecordedCommentThread = {
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }));

    const getReply = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    const recordedReply = await getReply.execute(useCasePayload);
    expect(recordedReply).toStrictEqual(expectedRecordedCommentThread);
    expect(mockReplyRepository.addThreadComment).toBeCalledWith({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    });
  });
});
