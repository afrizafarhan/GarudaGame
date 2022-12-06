class RecordedThread {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, title, owner } = payload;

        this.id = id;
        this.title = title;
        this.owner = owner;
    }

    _verifyPayload(payload) {
        if(!payload.id || !payload.title || !payload.owner) {
            throw new Error('RECORDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof payload.id !== "string" || typeof payload.title !== "string" || typeof payload.owner !== "string") {
            throw new Error('RECORDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

}

module.exports = RecordedThread;
