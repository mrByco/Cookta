using Kukta.FrameWork;
using Kukta.UI;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFrameworkV2
{
    public class Unit
    {
        public readonly UnitType Type;
        public readonly double? ToBase;
        public readonly string Name;
        public readonly string ShortName;

        private static List<Unit> units = new List<Unit>();

        public override string ToString()
        {
            return Name;
        }

        public Unit(UnitType type, double? toBase, string name, string shortName)
        {
            this.Type = type;
            this.ToBase = toBase;
            this.Name = name;
            this.ShortName = shortName;
        }

        public static async Task Init()
        {
            var res = await Networking.GetRequestSimple("units", new Dictionary<string, object>());
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
            double? toBase = jUnit.GetValue("tobase").Value<double?>();
            string name = jUnit.GetValue("name").Value<string>();
            string shortName = jUnit.GetValue("shortname")?.Value<string>();

            Unit unit = new Unit(type, toBase, name, shortName);
            return unit;
        }

        public static Ingredient ChangeUnitTo(Unit targetUnit, Ingredient ing)
        {
            if (GetUnit(ing.UnitName).ToBase != null && targetUnit.ToBase != null)
            {
                double ToBase = (double)GetUnit(ing.UnitName).ToBase;
                double BaseValue = (double)ing.Value * ToBase;
                return new Ingredient(ing.Type, (double)(BaseValue / targetUnit.ToBase), targetUnit.Name);
            }
            else
            {
                return null;
            }
        }
        public static Ingredient ChangeUnitTo(string unitID, Ingredient ing)
        {
            Unit unit = GetUnit(unitID);
            return ChangeUnitTo(unit, ing);
        }

        public static Unit GetUnit(string name)
        {
            return units.Find((unit) => { return unit.Name == name; });
        }
    }
    public enum UnitType
    {
        Volume, Count, Mass
    }
}
