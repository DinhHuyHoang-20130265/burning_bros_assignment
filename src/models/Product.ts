export class Product {
    id: number;
    title: string;
    price: number;
    description: string;
    thumbnail: string;

    constructor(id: number, title: string, price: number, description: string, thumbnail: string) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.thumbnail = thumbnail;
    }

    static fromApi(data: any): Product {
        return new Product(data.id, data.title, data.price, data.description, data.thumbnail);
    }
}
