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
        public List<IIngredientSource> InheritedFrom = new List<IIngredientSource>();

        public Ingredient(IngredientType type, double value, Unit unit, List<IIngredientSource> inheritedFrom)
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
        public static Ingredient operator -(Ingredient b, Ingredient c)
        {
            if (c.Type.ID != b.Type.ID)
                throw new InvalidOperationException();
            else if (c.Unit.id == b.Unit.id)
                return new Ingredient(b.Type, b.Value - c.Value, b.Unit, b.InheritedFrom);
            else if (c.Unit.ToBase == 0 || c.Unit.ToBase == 0)
                throw new InvalidOperationException();
            var newB = b.MemberwiseClone() as Ingredient;
            var newC = c.MemberwiseClone() as Ingredient;
            newB.ChangeUnitToBase();
            newC.ChangeUnitToBase();


            return new Ingredient(newB.Type, newB.Value - newC.Value, newB.Unit, b.InheritedFrom);
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
        public static List<Ingredient> SubstractList(List<Ingredient> f, List<Ingredient> w)
        {
            List<Ingredient> from = MergeList(f);
            List<Ingredient> what = MergeList(w);
            foreach (Ingredient sub in what)
            {
                List<Ingredient> SameTypes = from.FindAll((i) => { return i.Type.ID == sub.Type.ID; });
                Ingredient SameUnit = SameTypes.Find((i) => { return i.Unit.id == sub.Unit.id; });
                if (SameUnit != null)
                {
                    if (SameUnit.Value >= sub.Value)
                    {
                        from[from.IndexOf(SameUnit)].Value = SameUnit.Value - sub.Value;
                        continue;
                    }
                    else
                    {
                        from[from.IndexOf(SameUnit)].Value = 0;
                        sub.Value = sub.Value - SameUnit.Value;
                    }
                }
                else if (sub.Unit.ToBase != 0)
                {
                    List<Ingredient> BaseableAndNotZero = SameTypes.FindAll((i) => { return i.Unit.ToBase != 0 && i.Value > 0; });
                    while (sub.Value > 0 && BaseableAndNotZero.Count > 0)
                    {
                        Ingredient oldBase = BaseableAndNotZero[0].MemberwiseClone() as Ingredient;
                        BaseableAndNotZero[0] = BaseableAndNotZero[0] - sub;
                        Ingredient newSubValue = sub - (oldBase - BaseableAndNotZero[0]);
                        
                        sub.Unit = newSubValue.Unit;
                        sub.Value = newSubValue.Value;
                    }
                }
            }
            return from;
        }
        public Ingredient This
        {
            get
            {
                return this;
            }
        }
        internal static Ingredient ParseIngredient(JToken token, IIngredientSource source)
        {

            string IngID = token.Value<string>("ingredientID");
            string UnitID = token.Value<string>("unit");
            double Value = token.Value<double>("value");
            return new Ingredient(IngredientType.GetByID(IngID), Value, Unit.GetUnit(UnitID, Cooktapi.Food.IngredientType.GetByID(IngID)), new List<IIngredientSource>() { source });
        }
        internal static JObject CreateIngredientToServer(Ingredient ing)
        { 
            JObject jObject = new JObject();
            jObject.Add("ingredientID", ing.Type.ID);
            jObject.Add("unit", ing.Unit?.id);
            jObject.Add("value", ing.Value);
            return jObject;
        }
        internal static List<Ingredient> ParseIngredientList(string str)
        {
            List<Ingredient> Ingredients = new List<Ingredient>();
            if (str == "")
            {
                return new List<Ingredient>();
            }
            JArray jarray;
            try
            {
                jarray = JArray.Parse(str);
            }
            catch (JsonReaderException)
            {
                return new List<Ingredient>();
            }
            for (int i = 0; i < jarray.Count; i++)
            {
                Ingredients.Add(Ingredient.ParseIngredient(jarray.ElementAt(i), new CustomIngredientSource("Alaplista")));
            }
            return Ingredients;
        }
        public override string ToString() => string.Format("{0} {1} {2}", Value, Unit.Name, Type.Name);
    }

}
