using Kukta.FrameWork;
using Kukta.UI;
using Newtonsoft.Json;
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
        public Unit unit;
        public double Value;
        public readonly IngredientType Type;

        public Ingredient(IngredientType type, double value, Unit unit)
        {
            this.Type = type;
            this.Value = value;
            this.unit = unit;
        }
    }
    public class IngredientType
    {
        public bool MassEnabled { get; set; }
        public bool VolumeEnabled { get; set; }
        public bool CountEnabled { get; set; }
        public string Name { get; set; }
        public string ID { get; set; }
        public string Category { get; set; }
        public List<Unit> CustomUnits = new List<Unit>();
        public static List<string> GetCurrentUsetIngredientCategories()
        {
            List<string> Categories = new List<string>();
            foreach (IngredientType type in Types)
            {
                if (!Categories.Contains(type.Category))
                    Categories.Add(type.Category);
            }
            return Categories;
        }
        public IngredientType(bool massEnabled, bool volumeEnabled, bool countEnabled, string name, string id, string category, List<Unit> customUnits)
        {
            this.MassEnabled = massEnabled;
            this.VolumeEnabled = volumeEnabled;
            this.CountEnabled = countEnabled;
            this.Name = name;
            this.ID = id;
            this.Category = category;
            this.CustomUnits = customUnits;
        }
        public override string ToString()
        {
            return this.Name;
        }
        public static IngredientType GetByID(string ID)
        {
            return Types.Find( t => { return t.ID == ID; });
        }

        public static async Task Init()
        {
            var res = await Networking.GetRequestSimple("ingredients", new Dictionary<string, object>());
            JArray array = JArray.Parse(res.Content);
            Types = new List<IngredientType>();
            for (int i = 0; i < array.Count; i++)
            {
                Types.Add(ParseIngredientType(array.ElementAt(i).ToString(Newtonsoft.Json.Formatting.None)));
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
            units.AddRange(CustomUnits);
            return units;
        }

        internal static async Task Save(IngredientType ingredientType)
        {
            string body = ingredientType.CreateIngredientToServer();
            var res = await Networking.PostRequestWithForceAuth("ingredient", body);
            return;
        }

        private static IngredientType ParseIngredientType(string json)
        {
            JObject jIng = JObject.Parse(json);
            bool isMass =jIng.GetValue("mass-enabled").Value<bool>();
            bool isVol = jIng.GetValue("volume-enabled").Value<bool>();
            bool isCount = jIng.GetValue("count-enabled").Value<bool>();
            string name = jIng.GetValue("name").Value<string>();
            string category = jIng.GetValue("category").Value<string>();
            string guid = jIng.GetValue("guid").Value<string>();
            List<Unit> CustomUnits = new List<Unit>();

            JArray jarray = jIng.SelectToken(@"$.options.cunits")?.Value<JArray>();

            if (jarray != null)
            {
                for (int i = 0; i < jarray.Count; i++)
                {
                    string unitStr = jarray.ElementAt(i).ToString(Formatting.None);
                    CustomUnits.Add(Unit.ParseUnit(unitStr));
                }
            }
            IngredientType IngType = new IngredientType(isMass, isVol, isCount, name, guid, category, CustomUnits);
            return IngType;
        }
        public string CreateIngredientToServer()
        {
            JObject jIng = new JObject();
            jIng.Add("mass-enabled", MassEnabled);
            jIng.Add("volume-enabled", VolumeEnabled);
            jIng.Add("count-enabled", CountEnabled);
            jIng.Add("name", Name);
            jIng.Add("category", Category);
            jIng.Add("guid", ID);

            JObject options = new JObject();

            JArray JCunits = new JArray();
            foreach (Unit unit in CustomUnits)
            {
                JObject jObject = new JObject();
                jObject.Add("type", (int)unit.Type);
                jObject.Add("tobase", unit.ToBase);
                jObject.Add("id", unit.id);
                jObject.Add("name", unit.Name);
                JCunits.Add(jObject);
            }
            options.Add("cunits", JCunits);

            jIng.Add("options", options);

            return jIng.ToString(Formatting.None);
        }

        public static List<IngredientType> Search(int maxResult, string name)
        {
            List<IngredientType> result = new List<IngredientType>();
            foreach (IngredientType ing in Types)
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

        public static List<IngredientType> Types { get; private set; }
        
    }

}
