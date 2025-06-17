interface AppEvent {
    readonly type: string;
    data: string;
}

interface Subscriber {
    onEvent(event: AppEvent): void;
    subscribedEventTypes(): string[];
}

class EventBus {
    private subscribersByType: Map<string, Subscriber[]> = new Map();

    register(Subscriber: Subscriber){
        for(const type of Subscriber.subscribedEventTypes()){
            if(!this.subscribersByType.has(type)){
                this.subscribersByType.set(type, []);
            }
            this.subscribersByType.get(type)!.push(Subscriber);
        }
    }

    publish(event: AppEvent){
        const subs = this.subscribersByType.get(event.type) ?? [];
        for(const subscriber of subs){
            subscriber.onEvent(event);
        }
    }
}

class EmailService implements Subscriber{
    subscribedEventTypes(): string[] {
        return ['USER_SIGNUP', 'ORDER_PLACED'];
    }

    onEvent(event: AppEvent): void {
        console.log(`[EmailService] Handling ${event.type}: ${event.data}`)
    }
}

class SMSService implements Subscriber{
    subscribedEventTypes(): string[] {
        return ['ORDER_PLACED'];
    }

    onEvent(event: AppEvent): void {
        console.log(`[SMSService] Handling ${event.type}: ${event.data}`)
    }
}

class Producer {
    constructor(private eventBus: EventBus) {}

    send(event: AppEvent){
        console.log(`[Producer] Emitting event: ${event.type}`);
        this.eventBus.publish(event);
    }
}

const eventBus = new EventBus();

eventBus.register(new EmailService());
eventBus.register(new SMSService());

const producer = new Producer(eventBus);

producer.send({ type: 'USER_SIGNUP', data: 'rahul@dp.com' });
producer.send({ type: 'ORDER_PLACED', data: 'ORDER #12345' });
