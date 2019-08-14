using Cooktapi.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Calendar
{
    public class CalendarDay
    {
        public DateTime DateTime;
        public readonly Mealing[] Mealings = new Mealing[6];
        public CalendarDay(DateTime dateTime) : this()
        {
            DateTime = dateTime.CutToDay();
        }
        public CalendarDay()
        {
            for (int i = 0; i < Mealings.Length; i++)
            {
                Mealings[i] = new Mealing(this);
            }
        }
        public ref List<IMealingItem> GetItemsOf(EMealType type)
        {
            int index = (int)type;
            var mealing = Mealings[index];
            return ref mealing.items;
        }
        public string GetDayString()
        {
            return DateTime.ToString("yyyy-MM-dd");
        }
        public ref Mealing GetMealing(EMealType type)
        {
            return ref Mealings[(int)type];
        }


        public static async Task<CalendarDay> GetDay(DateTime dateTime)
        {
            var query = new Dictionary<string, object>();
            query.Add("date", dateTime.ToString("yyyy-MM-dd"));
            var response = await Networking.Networking.GetRequestWithForceAuth("day", query);
            return response.Content == "" ? new CalendarDay(dateTime) : await ParseDayFromServerJson(response.Content);
        }
        public static async Task SaveDay(CalendarDay day)
        {
            string body = CreateDayToServer(day);
            var res = await Networking.Networking.PostRequestWithForceAuth("day", body);
            return;
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
                            item = await Food.Food.Get(foodId) as IMealingItem;
                            break;
                        case "flag":
                            string flagId = jarray.ElementAt(i).Value<string>("id");
                            int seed = jarray.ElementAt(i).Value<int?>("seed") ?? 0;
                            string foodString = jarray.ElementAt(i).Value<JObject>("currentFood")?.ToString();
                            Food.Food currentFood = Food.Food.ParseFoodFromServerJson(foodString);
                            item = new Flag(currentFood, flagId, seed);
                            break;
                        case "list":
                            throw new NotImplementedException();
                        default:
                            throw new NotImplementedException();
                    };
                    if (item == null)
                        continue;
                    item.SetDose(jarray.ElementAt(i).Value<float?>("members") ?? 4f);
                    item.SetIsFixed(jarray.ElementAt(i).Value<bool?>("fixed") ?? false);
                    if (item != null)
                        day.Mealings[mealIndex].items.Add(item);
                    continue;
                }
            }
            return day;
        }
        private static string CreateDayToServer(CalendarDay day)
        {
            JObject jDay = new JObject();

            JArray mealArray = new JArray();
            for (int i = 0; i < day.Mealings.Length; i++)
            {
                Mealing meal = day.Mealings[i];
                foreach (IMealingItem item in meal.items)
                {
                    JObject jObject = new JObject();
                    string type = "";
                    int seed = 0;
                    if (item is Food.Food food)
                    {
                        type = "food";
                    }
                    else if (item is Flag flag)
                    {
                        type = "flag";
                        seed = flag.Seed;
                    }
                    else
                    {
                        return null;
                    }
                    jObject.Add("type", type);
                    jObject.Add("mealIndex", i);
                    jObject.Add("seed", seed);
                    jObject.Add("members", item.Dose());
                    jObject.Add("fixed", item.IsFixed());
                    jObject.Add("id", item.GetId());
                    mealArray.Add(jObject);
                }
            }
            jDay.Add("date", JToken.FromObject(day.DateTime.ToString("yyyy-MM-dd")));
            jDay.Add("mealings", mealArray);

            return jDay.ToString(Formatting.None);

        }
    }
}
