import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuPoolComponent} from './menu-pool.component';
import {PoolItemAnimationService} from "./pool-animation-service";
import {FoodService} from "../../shared/services/food.service";
import {Tag} from "../../shared/models/grocery/tag.model";
import {Guid} from "guid-typescript";
import {TagService} from "../../shared/services/tag.service";
import {MenuPoolToolbarComponent} from "./menu-pool-toolbar/menu-pool-toolbar.component";
import {Food} from 'src/app/shared/models/grocery/food.model';

function CreateFood(name: string): Food {
  let food: Food = {...FoodService.Placeholder} as any;
  food.name = name;
  return food;
}

const FakeFoods: Food[] = [
  CreateFood('food1'),
  CreateFood('food2'),
  CreateFood('food3'),
  CreateFood('food4'),
  CreateFood('food5'),
  CreateFood('food6'),
  CreateFood('food7'),
  CreateFood('food8'),
  CreateFood('food9'),
  CreateFood('food10'),
  CreateFood('food11'),
  CreateFood('food12'),
  CreateFood('food13'),
  CreateFood('food14'),
  CreateFood('food15'),

]
const FakeTags: Tag[] = [
  new Tag(Guid.create().toString(), 'Tag1', undefined, false),
  new Tag(Guid.create().toString(), 'Tag2', undefined, false),
  new Tag(Guid.create().toString(), 'Tag3', undefined, false),
  new Tag(Guid.create().toString(), 'Tag4', undefined, false),
  new Tag(Guid.create().toString(), 'Tag5', undefined, false),
  new Tag(Guid.create().toString(), 'Tag6', undefined, false),
]


describe('MenuPoolComponent', () => {
  let component: MenuPoolComponent;
  let fixture: ComponentFixture<MenuPoolComponent>;

  let foodServiceSpy: FoodService = new FoodService(undefined);
  let tagServiceSpy: TagService = new TagService(undefined, undefined);

  beforeEach(async(() => {
    spyOn(tagServiceSpy, 'LoadTags').and.returnValue(new Promise<Tag[]>(r => setTimeout(() => r(FakeTags), 10)));
    spyOn(foodServiceSpy, 'GetCollection').and.returnValue(new Promise<Food[]>(r => setTimeout(() => r(FakeFoods))));
    spyOn(foodServiceSpy, 'GetFoods').and.returnValue(new Promise<Food[]>(r => setTimeout(() => r(FakeFoods), 10)));
    TestBed.configureTestingModule({
      declarations: [MenuPoolComponent, MenuPoolToolbarComponent,],
      imports: [],
      providers: [
        PoolItemAnimationService,
        {provide: FoodService, useValue: foodServiceSpy},
        {provide: TagService, useValue: tagServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
