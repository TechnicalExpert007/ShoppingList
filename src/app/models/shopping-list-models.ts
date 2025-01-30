export interface ShoppingList {
    id: string;
    name: string;
    priority?: 'High' | 'Medium' | 'Low';
    items: ShoppingItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity?: number;
    notes?: string;
    isChecked: boolean;
}

export const CommonItems = [
    'Milk',
    'Bread',
    'Eggs',
    'Butter',
    'Cheese',
    'Rice',
    'Pasta',
    'Fruits',
    'Vegetables',
    'Chicken'
];
