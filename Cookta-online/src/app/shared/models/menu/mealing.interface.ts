import {EMealType} from './mealtype.enum';

export interface IMeal {
  type: string;
  mealIndex: EMealType;
  id: string;
  foodId: string;
  dose: number;
  info?: any;

}

