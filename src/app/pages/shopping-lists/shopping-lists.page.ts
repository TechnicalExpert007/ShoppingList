import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list-service';
import { ShoppingList } from '../../models/shopping-list-models';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  
  IonContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonBadge,
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trashOutline, 
  addOutline,
  createOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-shopping-lists',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Shopping Lists</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addList()" aria-label="Add new shopping list">
            <ion-icon name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let list of lists; trackBy: trackByFn" #slidingItem>
          <ion-item [routerLink]="['/list', list.id]" 
                   [attr.aria-label]="'Shopping list ' + list.name + (list.priority ? ', Priority: ' + list.priority : '')">
            <ion-label>
              <h2>{{ list.name }}</h2>
              <p *ngIf="list.priority">Priority: {{ list.priority }}</p>
              <p>Items: {{ list.items.length }}</p>
            </ion-label>
            <ion-badge slot="end" [color]="list.priority === 'High' ? 'danger' : 
                                       list.priority === 'Medium' ? 'warning' : 'success'">
              {{ list.priority }}
            </ion-badge>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" 
                            (click)="deleteList(list); slidingItem.close()"
                            aria-label="Delete list">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div class="ion-text-center ion-padding" *ngIf="lists.length === 0">
        <p>No shopping lists yet. Click the + button to create one!</p>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonBadge,
    IonIcon,
    IonButtons,
    IonButton
  ]
})


export class ShoppingListsPage implements OnInit {
  @ViewChildren(IonItemSliding) slidingItems!: QueryList<IonItemSliding>;
  lists: ShoppingList[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private alertController: AlertController
  ) {
    addIcons({
      trashOutline,
      addOutline,
      createOutline
    });
  }

  ngOnInit() {
    this.shoppingListService.getLists().subscribe(lists => {
      this.lists = lists;
    });
  }

  // Track by function for better performance
  trackByFn(index: number, item: ShoppingList) {
    return item.id;
  }

  // Close any open sliding items when leaving the page
  ionViewWillLeave() {
    this.slidingItems?.forEach(item => {
      item.close();
    });
  }

   async addList() {
    // First, show alert for list name
    const nameAlert = await this.alertController.create({
      header: 'New Shopping List',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'List Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Next',
          handler: async (data) => {
            if (data.name) {
              // Show priority selection after name is entered
              const priorityAlert = await this.alertController.create({
                header: 'Select Priority',
                message: 'Choose the priority level for your list:',
                inputs: [
                  {
                    type: 'radio',
                    name: 'priority',
                    value: 'High',
                    label: 'High Priority',
                    checked: true
                  },
                  {
                    type: 'radio',
                    name: 'priority',
                    value: 'Medium',
                    label: 'Medium Priority'
                  },
                  {
                    type: 'radio',
                    name: 'priority',
                    value: 'Low',
                    label: 'Low Priority'
                  }
                ],
                buttons: [
                  {
                    text: 'Back',
                    role: 'cancel',
                    handler: () => {
                      // Show the name alert again if user goes back
                      this.addList();
                    }
                  },
                  {
                    text: 'Create List',
                    handler: (priorityData) => {
                      this.shoppingListService.addList(data.name, priorityData);
                    }
                  }
                ]
              });
              await priorityAlert.present();
            }
          }
        }
      ]
    });

    await nameAlert.present();
  }

  async deleteList(list: ShoppingList) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${list.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.shoppingListService.deleteList(list.id);
          }
        }
      ]
    });

    await alert.present();
  }
}