import {Unit} from './unit.ingredient';

export class IngredientType {
  public Unit: Unit;
  public CustomUnits: Unit[];
  public Name: string;
  public Category: string;

  public CountEnabled;
  public VolumeEnabled;
  public MassEnabled;
}
