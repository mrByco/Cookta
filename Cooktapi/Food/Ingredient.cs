using Cooktapi.Measuring;
using Cooktapi.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Food
{
    public class Ingredient
    {
        public Unit Unit;
        public double Value;
        public readonly IngredientType Type;
        public List<Food> InheritedFrom = new List<Food>();

        public Ingredient(IngredientType type, double value, Unit unit, List<Food> inheritedFrom)
        {
            this.Type = type;
            this.Value = value;
            this.Unit = unit;
            this.InheritedFrom = inheritedFrom;
        }
        public string InheritedsString
        {
            get
            {
                string str = "";
                foreach (Food food in InheritedFrom)
                {
                    if (str.Length > 0)
                        str = str + ", ";
                    str = str + food.name;
                }
                return str;
            }
        }
        public void ChangeUnitToBase()
        {
            ChangeUnitToBase(Unit.GetBaseOf(Unit.Type));
        }
        public void ChangeUnitToBase(Unit baseUnit)
        {
            if (Unit.ToBase == 0)
                throw new InvalidOperationException();
            if (baseUnit.ToBase != 1)
                throw new InvalidOperationException();
            Value = Value * Unit.ToBase;
            Unit = baseUnit;
        }
        public static Ingredient operator +(Ingredient b, Ingredient c)
        {
            if (c.Type.ID != b.Type.ID)
                throw new InvalidOperationException();
            else if (c.Unit.id == b.Unit.id)
                return new Ingredient(b.Type, b.Value + c.Value, b.Unit, b.InheritedFrom.Union(c.InheritedFrom).ToList());
            else if (c.Unit.ToBase == 0 || c.Unit.ToBase == 0)
                throw new InvalidOperationException();
            var newB = b.MemberwiseClone() as Ingredient;
            var newC = c.MemberwiseClone() as Ingredient;
            newB.ChangeUnitToBase();
            newC.ChangeUnitToBase();


            return new Ingredient(newB.Type, newB.Value + newC.Value, newB.Unit, b.InheritedFrom.Union(c.InheritedFrom).ToList());
        }
        public static List<Ingredient> MergeList(List<Ingredient> list)
        {
            var newList = new List<Ingredient>();
            foreach (Ingredient ing in list)
            {
                var alreadyIngs = newList.FindAll((i) => { return i.Type.ID == ing.Type.ID; });

                if (alreadyIngs.Count > 0)
                {
                    var BaseOrToBaseable = alreadyIngs.Find((i) => { return i.Unit.IsGeneric || i.Unit.ToBase != 0; });
                    var sameTypeAndUnit = alreadyIngs.Find((i) => { return i.Unit.id == ing.Unit.id && i.Type.ID == ing.Type.ID; });
                    if (BaseOrToBaseable != null && (ing.Unit.ToBase != 0 || ing.Unit.IsGeneric))
                    {
                        newList[newList.IndexOf(BaseOrToBaseable)] = ing + BaseOrToBaseable;
                    }
                    else if (sameTypeAndUnit != null)
                    {
                        newList[newList.IndexOf(sameTypeAndUnit)] = ing + sameTypeAndUnit;
                    }
                    else
                    {
                        if (ing.Unit.IsGeneric || ing.Unit.ToBase != 0)
                        {
                            ing.ChangeUnitToBase();
                            newList.Add(ing);
                        }
                        else
                        {
                            newList.Add(ing);
                        }
                    }
                }
                else
                {
                    if (ing.Unit.IsGeneric || ing.Unit.ToBase != 0)
                    {
                        ing.ChangeUnitToBase();
                        newList.Add(ing);
                    }
                    else
                    {
                        newList.Add(ing);
                    }
                }

            }
            return newList;
        }
        public Ingredient This
        {
            get
            {
                return this;
            }
        }
        public override string ToString() => string.Format("{0} {1} {2}", Value, Unit.Name, Type.Name);
    }

}
