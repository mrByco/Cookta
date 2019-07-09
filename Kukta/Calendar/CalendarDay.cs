using Kukta.FoodFrameworkV2;
using Kukta.FrameWork;
using Kukta.Menu;
using Kukta.SaveLoad.File;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Calendar
{
    public class CalendarDay
    {
        public DateTime DateTime;
        public Mealing[] mealings = new Mealing[6];
        public CalendarDay(DateTime dateTime)
        {
            DateTime = dateTime.CutToDay();
        }
        public CalendarDay()
        {

        }
        public List<IMealingItem> GetItemsOf(EMealType type)
        {
            int index = (int)type;
            var mealing = mealings[index];
            return mealing.items;
        }
        public string GetDayString()
        {
            return DateTime.ToString("yyyy-MM-dd");
        }

        internal static async Task<CalendarDay> GetDay(DateTime dateTime)
        {
            var query = new Dictionary<string, object>();
            query.Add("date", dateTime.ToString("yyyy-MM-dd"));
            var response = await Networking.GetRequestWithForceAuth("day", query);
            return await ParseDayFromServerJson(response.Content);
        }

        private static async Task<CalendarDay> ParseDayFromServerJson(string json)
        {
            JObject jFood = JObject.Parse(json);
            CalendarDay day = new CalendarDay();

            string dateString = jFood.GetValue("date").Value<string>();
            string format = "yyyy-MM-dd";
            DateTime date;
            DateTime.TryParseExact(
                dateString,
                format,
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None,
                out date);
            day.DateTime = date;

            JArray jarray = jFood.GetValue("mealings").Value<JArray>();
            if (jarray != null)
            {
                for (int i = 0; i < jarray.Count; i++)
                {
                    int mealIndex = jarray.ElementAt(i).Value<int>("mealIndex");
                    string typeString = jarray.ElementAt(i).Value<string>("type");
                    IMealingItem item;
                    switch (typeString)
                    {
                        case "food":
                            string foodId = jarray.ElementAt(i).Value<string>("id");
                            item = await Food.Get(foodId) as IMealingItem;
                            break;
                        case "flag":
                            throw new NotImplementedException();
                        case "list":
                            throw new NotImplementedException();
                        default:
                            throw new NotImplementedException();
                    };
                    day.mealings[mealIndex].items.Add(item);
                    continue;
                }
            }
            return day;
        }
        public static string CreateDayToServer(CalendarDay days)
        {
            JObject jFood = new JObject();

            JArray ingArray = new JArray();
            foreach (Ingredient ing in food.ingredients)
            {
                JObject jObject = new JObject();
                jObject.Add("ingredientID", ing.Type.ID);
                jObject.Add("unit", ing.UnitName);
                jObject.Add("value", ing.Value);
                ingArray.Add(jObject);
            }

            if (food._id != null)
            {
                jFood.Add("_id", JToken.FromObject(food._id));
            }
            jFood.Add("name", JToken.FromObject(food.name));
            jFood.Add("private", JToken.FromObject(food.isPrivate));
            jFood.Add("makeTime", JToken.FromObject(food.makeTime));
            jFood.Add("desc", JToken.FromObject(food.desc));
            jFood.Add("ingredients", ingArray);

            return jFood.ToString(Formatting.None);

        }
    }
}
