using Cooktapi.Food;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Measuring
{
    public class Unit
    {
        public readonly UnitType Type;
        public readonly double ToBase;
        public readonly string Name;
        public readonly string id;
        public readonly string ShortName;

        private static List<Unit> units = new List<Unit>();

        public override string ToString()
        {
            return Name;
        }

        public Unit(UnitType type, double toBase, string name, string shortName, string id)
        {
            this.Type = type;
            this.ToBase = toBase;
            this.Name = name;
            this.ShortName = shortName;
            this.id = id;
        }

        public static async Task Init()
        {
            var res = await Networking.Networking.GetRequestSimple("units", new Dictionary<string, object>());
            if (res.StatusCode != System.Net.HttpStatusCode.OK)
            {

            }
            JArray array = JArray.Parse(res.Content);
            units = new List<Unit>();
            for (int i = 0; i < array.Count; i++)
            {
                units.Add(ParseUnit(array.ElementAt(i).ToString(Newtonsoft.Json.Formatting.None)));
            }
            return;
        }
        public bool IsGeneric
        {
            get
            {
                return Unit.GetUnits().Contains(this);
            }
        }

        public static List<Unit> GetUnits()
        {
            return units;
        }

        public static Unit ParseUnit(string json)
        {
            JObject jUnit = JObject.Parse(json);
            return ParseUnit(jUnit);
        }
        public static Unit ParseUnit(JObject jUnit)
        {
            UnitType type = (UnitType)(jUnit.GetValue("type").Value<int>());
            double toBase = jUnit.GetValue("tobase")?.Value<double?>() ?? 0;
            string name = jUnit.GetValue("name").Value<string>();
            string id = jUnit.GetValue("id").Value<string>();
            string shortName = jUnit.GetValue("shortname")?.Value<string>();

            Unit unit = new Unit(type, toBase, name, shortName, id);
            return unit;
        }

        public static Ingredient ChangeUnitTo(Unit targetUnit, Ingredient ing)
        {
            if (ing.Unit.ToBase != 0 && targetUnit.ToBase != 0)
            {
                double ToBase = (double)ing.Unit.ToBase;
                double BaseValue = (double)ing.Value * ToBase;
                return new Ingredient(ing.Type, (double)(BaseValue / targetUnit.ToBase), targetUnit);
            }
            else
            {
                return null;
            }
        }
        public static Ingredient ChangeUnitTo(string unitID, Ingredient ing)
            {
                Unit unit = GetUnit(unitID, ing.Type);
                return ChangeUnitTo(unit, ing);
            }

            public static Unit GetUnit(string id)
        {
            return units.Find((unit) => { return unit.id == id; });
        }
        public static Unit GetUnit(string id, IngredientType ingType)
        {
            Unit unit = GetUnit(id);
            if (unit == null)
            {
                unit = ingType.CustomUnits.Find((u2) => { return u2.id == id; });
            }
            return unit;
        }
        public static List<UnitType> GetUnitTypes
        {
            get
            {
                List<UnitType> enums = new List<UnitType>();
                foreach (UnitType type in Enum.GetValues(typeof(UnitType)))
                {
                    enums.Add(type);
                }
                return enums;
            }
        }
        public static Unit GetBaseOf(UnitType type)
        {
            switch (type)
            {
                case UnitType.Count:
                    return GetUnit("db") ?? new Unit(UnitType.Count, 1, "db", "db", "db");
                case UnitType.Mass:
                    return GetUnit("g") ?? new Unit(UnitType.Mass, 1, "gramm", "g", "g");
                case UnitType.Volume:
                    return GetUnit("l") ?? new Unit(UnitType.Volume, 1, "liter", "l", "l");
                default:
                    throw new Exception();
            }
        }
    }
    public enum UnitType
    {
        Volume, Count, Mass
    }
}
