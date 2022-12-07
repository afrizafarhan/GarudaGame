class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { title, body, userId } = payload;

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  _verifyPayload(payload) {
    if (!payload.title || !payload.body || !payload.userId) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.title !== 'string' || typeof payload.body !== 'string' || typeof payload.userId !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
