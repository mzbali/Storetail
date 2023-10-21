export interface Address {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface OrderItem {
    productId: number;
    name: string;
    pictureUrl: string;
    quantity: number;
    price: number;
}

export interface OrderValue {
    saveAddress: boolean;
    shippingAddress: Address;
}

export interface Order {
    id: number;
    buyerId: string;
    address: Address;
    orderItems: OrderItem[];
    orderDate: Date;
    subTotal: number;
    orderStatus: string;
    deliveryFee: number;
    total: number;
}


