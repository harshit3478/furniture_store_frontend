export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    rating: number;
    image: string;
    description: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: 'Modern Leather Sofa',
        price: 799,
        category: 'Sofas',
        rating: 4.5,
        image: '/sofa.jpg',
        description: 'Premium quality leather sofa with ergonomic design'
    },
    {
        id: 2,
        name: 'Wooden Dining Table',
        price: 499,
        category: 'Tables',
        rating: 4.2,
        image: '/dining-table.jpg',
        description: 'Solid oak dining table with 6-seater capacity'
    },
    {
        id: 3,
        name: 'King Size Bed',
        price: 1299,
        category: 'Beds',
        rating: 4.8,
        image: '/bed.jpg',
        description: 'Luxurious king size bed with storage'
    },
    {
        id: 4,
        name: 'Office Chair',
        price: 199,
        category: 'Chairs',
        rating: 4.0,
        image: '/office-chair.jpg',
        description: 'Ergonomic office chair with lumbar support'
    },
    {
        id: 5,
        name: 'Modern TV Stand',
        price: 299,
        category: 'TV Stands',
        rating: 4.3,
        image: '/tv-stand.jpg',
        description: 'Stylish TV stand with ample storage space'
    },
    {
        id: 6,
        name: 'Recliner Chair',
        price: 399,
        category: 'Chairs',
        rating: 4.6,
        image: '/recliner.jpg',
        description: 'Comfortable recliner chair with footrest'
    },
    {
        id: 7,
        name: 'Coffee Table',
        price: 299,
        category: 'Tables',
        rating: 4.1,
        image: '/coffee-table.jpg',
        description: 'Modern coffee table with tempered glass top'
    },
    {
        id: 8,
        name: 'Wardrobe',
        price: 899,
        category: 'Storage',
        rating: 4.7,
        image: '/wardrobe.jpg',
        description: 'Spacious wardrobe with sliding doors'
    },
    {
        id: 9,
        name: 'Accent Chair',
        price: 249,
        category: 'Chairs',
        rating: 4.4,
        image: '/accent-chair.jpg',
        description: 'Stylish accent chair with cushioned seat'
    },
    {
        id: 10,
        name: 'Study Desk',
        price: 149,
        category: 'Desks',
        rating: 4.2,
        image: '/study-desk.jpg',
        description: 'Compact study desk with bookshelf'
    },
    {
        id: 11,
        name: 'Bar Stool',
        price: 79,
        category: 'Chairs',
        rating: 4.0,
        image: '/bar-stool.jpg',
        description: 'Adjustable bar stool with footrest'
    },
    {
        id: 12,
        name: 'Outdoor Furniture Set',
        price: 999,
        category: 'Outdoor',
        rating: 4.5,
        image: '/outdoor-furniture.jpg',
        description: 'Weather-resistant outdoor furniture set'

    }
];
