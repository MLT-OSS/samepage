export enum EventType {
    RESPONSE_ERROR = 'responseError',
    CLOSE_EXTENSION = 'closeExtension'
}

type ICallback = (data?: any) => void;

/**
 * Event emitter to subscribe, dispatch, and unsubscribe to events.
 */
export const eventEmitter: {
    readonly events: Record<string, ICallback[]>;
    dispatch: (eventType: EventType, uniqueSuffix: string | number, data?: any) => void;
    subscribe: (eventType: EventType, uniqueSuffix: string | number, callback: ICallback) => void;
    unsubscribe: (eventType: EventType, uniqueSuffix: string | number) => void;
    getEventKey: (eventType: EventType, uniqueSuffix: string | number) => string;
} = {
    // This is event object to store events.
    events: {},

    // Internal function to get event name from type and suffix
    getEventKey(eventType: EventType, uniqueSuffix: string | number) {
        return `${eventType}${uniqueSuffix}`;
    },

    // This will dispatch the event and call the callback for every event.
    dispatch(event, uniqueSuffix, data) {
        const eventName = this.getEventKey(event, uniqueSuffix);
        if (!this.events[eventName]) return;
        this.events[eventName].forEach((callback: ICallback) => callback(data));
    },

    // This will subscribe the event with a specific callback
    subscribe(event, uniqueSuffix, callback) {
        const eventName = this.getEventKey(event, uniqueSuffix);
        if (!this.events[eventName]) this.events[eventName] = [];
        if (!this.events[eventName]?.includes(this.events[eventName][0])) this.events[eventName]?.push(callback);
    },

    // This will unsubscribe the event to avoid unnecessary event calls
    unsubscribe(event, uniqueSuffix) {
        const eventName = this.getEventKey(event, uniqueSuffix);
        if (!this.events[eventName]) return;
        delete this.events[eventName];
    }
};
