import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list-service';
import { ShoppingItem, ShoppingList } from '../../models/shopping-list-models';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonCheckbox,
  AlertController,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trashOutline, 
  addOutline,
  createOutline,
  chevronBackOutline,
  pencilOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonCheckbox,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/lists" aria-label="Go back to lists"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ list?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let item of list?.items; trackBy: trackByFn" #slidingItem>
          <ion-item>
            <ion-checkbox slot="start" 
                         [(ngModel)]="item.isChecked"
                         (ionChange)="updateItem(item)"
                         [attr.aria-label]="'Mark ' + item.name + ' as ' + (item.isChecked ? 'incomplete' : 'complete')">
            </ion-checkbox>
            <ion-label [class.completed]="item.isChecked">
              <h2>{{ item.name }}</h2>
              <p *ngIf="item.quantity && item.quantity > 1">Quantity: {{ item.quantity }}</p>
              <p *ngIf="item.notes">{{ item.notes }}</p>
            </ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="primary" 
                            (click)="editItem(item); slidingItem.close()"
                            [attr.aria-label]="'Edit ' + item.name">
              <ion-icon slot="icon-only" name="pencil-outline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" 
                            (click)="removeItem(item); slidingItem.close()"
                            [attr.aria-label]="'Delete ' + item.name">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="addItem()" aria-label="Add new item">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .completed {
      text-decoration: line-through;
      opacity: 0.7;
    }
  `]
})
export class ListDetailPage implements OnInit {
  @ViewChildren(IonItemSliding) slidingItems!: QueryList<IonItemSliding>;
  list?: ShoppingList;
  
  constructor(
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private alertController: AlertController
  ) {
    addIcons({
      trashOutline,
      addOutline,
      createOutline,
      chevronBackOutline,
      pencilOutline
    });
  }

  ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.shoppingListService.getLists().subscribe(lists => {
        this.list = lists.find(l => l.id === listId);
      });
    }
  }

  async editItem(item: ShoppingItem) {
    const alert = await this.alertController.create({
      header: 'Edit Item',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: item.name,
          placeholder: 'Item name'
        },
        {
          name: 'quantity',
          type: 'number',
          value: item.quantity || 1,
          placeholder: 'Quantity',
          min: 1
        },
        {
          name: 'notes',
          type: 'text',
          value: item.notes || '',
          placeholder: 'Notes (optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            if (this.list && data.name) {
              this.shoppingListService.updateItem(this.list.id, item.id, {
                name: data.name,
                quantity: parseInt(data.quantity) || 1,
                notes: data.notes
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Add Item method updated to include quantity
  async addItem() {
    const alert = await this.alertController.create({
      header: 'Add Item',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Item name'
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',
          min: 1,
          value: 1
        },
        {
          name: 'notes',
          type: 'text',
          placeholder: 'Notes (optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (this.list && data.name) {
              this.shoppingListService.addItem(this.list.id, {
                name: data.name,
                quantity: parseInt(data.quantity) || 1,
                notes: data.notes
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async removeItem(item: ShoppingItem) {
    if (this.list) {
      await this.shoppingListService.removeItem(this.list.id, item.id);
    }
  }

  async updateItem(item: ShoppingItem) {
    if (this.list) {
      await this.shoppingListService.updateItem(this.list.id, item.id, {
        isChecked: item.isChecked
      });
    }
  }

  trackByFn(index: number, item: ShoppingItem) {
    return item.id;
  }

  ionViewWillLeave() {
    this.slidingItems?.forEach(item => {
      item.close();
    });
  }
}