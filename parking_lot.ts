export interface Subscriber {
  update(event: ParkingEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingEvent): void;
}

export type ParkingEvent = {
  lotName: string;
  occupied: number;
  capacity: number;
  action: "entered" | "left";
};

export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notify(event: ParkingEvent): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(event);
    }
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify({ lotName: this.name, occupied: this.occupied, capacity: this.capacity, action: "entered" });
    } else {
      throw new Error(`the parking lot is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify({ lotName: this.name, occupied: this.occupied, capacity: this.capacity, action: "left" });
    } else {
      throw new Error(`the parking lot is empty`);
    }
  }

  isFull() {
    return this.occupied == this.capacity;
  }

  isEmpty() {
    return this.occupied == 0;
  }
}
export class Display implements Subscriber {
  update(event: ParkingEvent): void {
    console.log(`A car ${event.action} the lot ${event.lotName}: ${event.occupied}/${event.capacity} occupied.`);
  }
}