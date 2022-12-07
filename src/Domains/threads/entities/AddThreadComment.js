class AddThreadComment {
  constructor(payload) {
    this.verifyPayload(payload);
    const { content, userId, threadId } = payload;
    this.content = content;
    this.userId = userId;
    this.threadId = threadId;
  }

  verifyPayload(payload) {
    if (!payload.content || !payload.userId || !payload.threadId) {
      throw new Error('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.content !== 'string' || typeof payload.userId !== 'string' || typeof payload.threadId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadComment;
