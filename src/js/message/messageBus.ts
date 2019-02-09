import { IMessageHandler } from "./IMessageHandler";
import { MessageSubscriptionNode } from "./messageSubscritionNode";
import { Message, MessagePriority } from "./message";

export class MessageBus {

    private static _subscriptions: {[code: string]: IMessageHandler[]} = {};

    private static _normalQueueMessgePerUpdate: number = 10;
    private static _normalMessageQueue: MessageSubscriptionNode[] = [];


    private constructor() {

    }

    public static addSubscription(code: string, handler: IMessageHandler) {
        if ( MessageBus._subscriptions[code] === undefined) {
            MessageBus._subscriptions[code] = [];
        }

        if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
            console.warn('Attempting to add a duplicate handler to code: ' + code + '. Subscription not added.');
        } else {
            MessageBus._subscriptions[code].push(handler);
        }
    }

    public static removeSubscription(code: string, handler: IMessageHandler) {
        if ( MessageBus._subscriptions[code] === undefined) {
            console.warn('Cannot unsubscribe handler from code: ' + code + '. Because that code is not subscibed to.');
            return;
        }

        let nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
        if (nodeIndex !== -1) {
            MessageBus._subscriptions[code].splice(nodeIndex, 1)
            
        } 
        
    }

    public static post(message: Message): void {
        console.log('Message posted:', message);
        let handlers = MessageBus._subscriptions[message.code];
        if (handlers === undefined) {
            return;
        }

        for(let h of handlers) {
            if(message.priority === MessagePriority.HIGH) {
                h.onMessage(message);
            } else {
                MessageBus._normalMessageQueue.push(new MessageSubscriptionNode(message, h));
            }
        }
    }

    public static update(time: number): void {
        if(MessageBus._normalMessageQueue.length === 0) {
            return;
        }

        let messageLimit = Math.min(MessageBus._normalQueueMessgePerUpdate, MessageBus._normalMessageQueue.length);

        for (let i = 0; i < messageLimit; i++) {
            let node = MessageBus._normalMessageQueue.pop();
            node.handler.onMessage(node.message);
        }


    }
}