using Kukta.FoodFrameworkV2;
using Kukta.FrameWork;
using Kukta.Menu;
using Kukta.SaveLoad.File;
using Newtonsoft.Json;
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
        public readonly Mealing[] mealings = new Mealing[6];
        public CalendarDay(DateTime dateTime) : this()
        {
            DateTime = dateTime.CutToDay();
        }
        public CalendarDay()
        {
            for (int i = 0; i < mealings.Length; i++)
            {
                mealings[i] = new Mealing(this);
            }
        }
        public ref List<IMealingItem> GetItemsOf(EMealType type)
        {
            int index = (int)type;
            var mealing = mealings[index];
            return ref mealing.items;
        }
        public string GetDayString()
        {
            return DateTime.ToString("yyyy-MM-dd");
        }
        public ref Mealing GetMealing(EMealType type)
        {
            return ref mealings[(int)type];
        }


        internal static async Task<CalendarDay> GetDay(DateTime dateTime)
        {
            var query = new Dictionary<string, object>();
            query.Add("date", dateTime.ToString("yyyy-MM-dd"));
            var response = await Networking.GetRequestWithForceAuth("day", query);
            return response.Content == "" ? new CalendarDay(dateTime) : await ParseDayFromServerJson(response.Content);
        }
        internal static async Task SaveDay(CalendarDay day)
        {
            string body = CreateDayToServer(day);
            var res = await Networking.PostRequestWithForceAuth("day", body);
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
                            item = await Food.Get(foodId) as IMealingItem;
                            break;
                        case "flag":
                            throw new NotImplementedException();
                        case "list":
                            throw new NotImplementedException();
                        default:
                            throw new NotImplementedException();
                    };
                    if (item != null)
                        day.mealings[mealIndex].items.Add(item);
                    continue;
                }
            }
            return day;
        }
        public static string CreateDayToServer(CalendarDay day)
        {
            JObject jDay = new JObject();

            JArray mealArray = new JArray();
            for (int i = 0; i < day.mealings.Length; i++)
            {
                Mealing meal = day.mealings[i];
                foreach (IMealingItem item in meal.items)
                {
                    JObject jObject = new JObject();
                    string type = "";
                    if (item is Food)
                    {
                        type = "food";
                    }
                    else
                    {
                        return null;
                    }
                    jObject.Add("type", type);
                    jObject.Add("mealIndex", i);
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
