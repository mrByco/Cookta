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

        public Ingredient(IngredientType type, double value, Unit unit)
        {
            this.Type = type;
            this.Value = value;
            this.Unit = unit;
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
                return new Ingredient(b.Type, b.Value + c.Value, b.Unit);
            else if (c.Unit.ToBase == 0 || c.Unit.ToBase == 0)
                throw new InvalidOperationException();
            var newB = b.MemberwiseClone() as Ingredient;
            var newC = c.MemberwiseClone() as Ingredient;
            newB.ChangeUnitToBase();
            newC.ChangeUnitToBase();


            return new Ingredient(newB.Type, newB.Value + newC.Value, newB.Unit);
        }
        public override string ToString()
        {
            return string.Format("{0} {1} {2}", Value, Unit.Name, Type.Name);
        }
    }

}
