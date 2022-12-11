class AddThreadCommentReply {
  constructor(payload) {
    this.verifyPayload(payload);
    const { content, userId, commentId } = payload;
    this.content = content;
    this.userId = userId;
    this.commentId = commentId;
  }

  verifyPayload(payload) {
    if (!payload.content || !payload.userId || !payload.commentId) {
      throw new Error('ADD_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.content !== 'string' || typeof payload.userId !== 'string' || typeof payload.commentId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadCommentReply;
