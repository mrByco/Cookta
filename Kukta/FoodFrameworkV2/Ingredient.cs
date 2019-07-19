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
    public class Ingredient
    {
        public string UnitName;
        public double Value;
        public readonly IngredientType Type;

        public Ingredient(IngredientType type, double value, string unitName)
        {
            this.Type = type;
            this.Value = value;
            this.UnitName = unitName;
        }
    }
    public class IngredientType
    {
        public readonly bool MassEnabled;
        public readonly bool VolumeEnabled;
        public readonly bool CountEnabled;
        public readonly string Name;
        public readonly string ID;
        public readonly string Category;

        public IngredientType(bool massEnabled, bool volumeEnabled, bool countEnabled, string name, string id, string category)
        {
            this.MassEnabled = massEnabled;
            this.VolumeEnabled = volumeEnabled;
            this.CountEnabled = countEnabled;
            this.Name = name;
            this.ID = id;
            this.Category = category;
        }
        public override string ToString()
        {
            return this.Name;
        }
        public static IngredientType GetByID(string ID)
        {
            return types.Find( t => { return t.ID == ID; });
        }

        public static async Task Init()
        {
            var res = await Networking.GetRequestSimple("ingredients", new Dictionary<string, object>());
            JArray array = JArray.Parse(res.Content);
            types = new List<IngredientType>();
            for (int i = 0; i < array.Count; i++)
            {
                types.Add(ParseIngredientType(array.ElementAt(i).ToString(Newtonsoft.Json.Formatting.None)));
            }
            return;
        }

        public List<Unit> GetUnits()
        {
            List<Unit> units = new List<Unit>();
            foreach (Unit u in Unit.GetUnits())
            {
                switch (u.Type)
                {
                    case UnitType.Count:
                        if (CountEnabled)
                            units.Add(u);
                        break;
                    case UnitType.Mass:
                        if (MassEnabled)
                            units.Add(u);
                        break;
                    case UnitType.Volume:
                        if (VolumeEnabled)
                            units.Add(u);
                        break;
                }
            }
            return units;
        }

        private static IngredientType ParseIngredientType(string json)
        {
            JObject jIng = JObject.Parse(json);
            bool isMass =jIng.GetValue("mass-enabled").Value<bool>();
            bool isVol = jIng.GetValue("volume-enabled").Value<bool>();
            bool isCount = jIng.GetValue("count-enabled").Value<bool>();
            string name = jIng.GetValue("name").Value<string>();
            string category = jIng.GetValue("category").Value<string>();
            string baseUnitName = jIng.GetValue("base-unit").Value<string>();
            string guid = jIng.GetValue("guid").Value<string>();
            Unit baseUnit = Unit.GetUnit(baseUnitName);

            IngredientType IngType = new IngredientType(isMass, isVol, isCount, name, guid, category);
            return IngType;
        }

        public static List<IngredientType> Search(int maxResult, string name)
        {
            List<IngredientType> result = new List<IngredientType>();
            foreach (IngredientType ing in types)
            {
                if (ing.ToString().ToLower().Contains(name.ToLower()))
                {
                    result.Add(ing);
                }
                if (result.Count >= maxResult)
                    return result;
            }
            return result;
        }

        private static List<IngredientType> types;

    }

}
