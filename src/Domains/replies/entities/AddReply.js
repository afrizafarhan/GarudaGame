class AddThreadCommentReply {
  constructor(payload) {
    this.verifyPayload(payload);
    const {
      content,
      userId,
      commentId,
      threadId,
    } = payload;
    this.content = content;
    this.userId = userId;
    this.commentId = commentId;
    this.threadId = threadId;
  }

  verifyPayload(payload) {
    if (!payload.content || !payload.userId || !payload.commentId || !payload.threadId) {
      throw new Error('ADD_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.content !== 'string' || typeof payload.userId !== 'string' || typeof payload.commentId !== 'string' || typeof payload.threadId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadCommentReply;
