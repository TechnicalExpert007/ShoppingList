import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingList, ShoppingItem } from '../models/shopping-list-models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService {
    private _storage: Storage | null = null;
    private _lists = new BehaviorSubject<ShoppingList[]>([]);

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        const storage = await this.storage.create();
        this._storage = storage;
        this.loadLists();
    }

    private async loadLists() {
        const lists = await this._storage?.get('shopping-lists') || [];
        this._lists.next(lists);
    }

    getLists(): Observable<ShoppingList[]> {
        return this._lists.asObservable();
    }

    async addList(name: string, priority?: 'High' | 'Medium' | 'Low',items: ShoppingItem[] = []): Promise<void> {
        const lists = this._lists.value;
        const newList: ShoppingList = {
            id: uuidv4(),
            name,
            priority,
            items: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        lists.push(newList);
        await this._storage?.set('shopping-lists', lists);
        this._lists.next(lists);
    }

    async addItem(listId: string, item: Partial<ShoppingItem>): Promise<void> {
        const lists = this._lists.value;
        const list = lists.find(l => l.id === listId);
        if (list) {
            const newItem: ShoppingItem = {
                id: uuidv4(),
                name: item.name || '',
                quantity: item.quantity || 1,
                notes: item.notes,
                isChecked: false
            };
            list.items.push(newItem);
            list.updatedAt = new Date();
            await this._storage?.set('shopping-lists', lists);
            this._lists.next(lists);
        }
    }

    async updateItem(listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<void> {
        const lists = this._lists.value;
        const list = lists.find(l => l.id === listId);
        if (list) {
            const item = list.items.find(i => i.id === itemId);
            if (item) {
                Object.assign(item, updates);
                list.updatedAt = new Date();
                await this._storage?.set('shopping-lists', lists);
                this._lists.next(lists);
            }
        }
    }

    async removeItem(listId: string, itemId: string): Promise<void> {
        const lists = this._lists.value;
        const list = lists.find(l => l.id === listId);
        if (list) {
            list.items = list.items.filter(item => item.id !== itemId);
            list.updatedAt = new Date();
            await this._storage?.set('shopping-lists', lists);
            this._lists.next(lists);
        }
    }

    async deleteList(listId: string): Promise<void> {
        const lists = this._lists.value.filter(list => list.id !== listId);
        await this._storage?.set('shopping-lists', lists);
        this._lists.next(lists);
    }
}