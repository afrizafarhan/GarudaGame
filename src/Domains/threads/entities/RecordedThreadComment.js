class RecordedCommentThread {
  constructor(payload) {
    this.verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  /**
   * This function will verify the payload
   *
   * @param {object} payload
   */
  verifyPayload(payload) {
    if (!payload.id || !payload.content || !payload.owner) {
      throw new Error('RECORDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.id !== 'string' || typeof payload.content !== 'string' || typeof payload.owner !== 'string') {
      throw new Error('RECORDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RecordedCommentThread;
