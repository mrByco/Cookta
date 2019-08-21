using Cooktapi.Calendar;
using Cooktapi.Extensions;
using Cooktapi.Food;
using Cooktapi.Measuring;
using Cooktapi.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Food
{
    public class Food : AMealingItem, IMealingItem, IIngredientSource
    {
        public string _id;
        public string owner;
        public int? makeTime = 0;
        public bool owning
        {
            get
            {
                return this.owner == OwnUser.CurrentUser.Sub;
            }
        }
        public bool subcribed { get; set; }
        public int dose = 4;
        public bool isPrivate;
        public string name;
        public string desc;
        public string imageURL;
        public DateTime LastModified { get; private set; }
        public long? imageUploaded { get; private set; }
        public List<Tag> Tags = new List<Tag>();
        public List<Ingredient> ingredients = new List<Ingredient>();
        public Food GetMealFood() { return this; }
        public Food This => this;
        public string GetId() { return _id; }
        public void NewSeed() { return; }
        public string GetName() { return name; }
        public Uri getImage
        {
            get
            {
                if (imageURL != null && imageURL != "")
                {
                    var bitmapUri = new Uri(imageURL.ToString(), UriKind.Absolute);
                    return bitmapUri;
                }
                return new Uri("https://kuktaimages.blob.core.windows.net/application/Square44x44Logo.altform-unplated_targetsize-256.png", UriKind.Absolute);
            }
        }
        public override string ToString()
        {
            return name;
        }
        public string GetIngredientArray
        {
            get
            {
                string list = "";
                foreach (Ingredient ing in ingredients)
                {
                    if (list.Length > 0)
                        list = list + ", ";
                    list = list + ing.Type.Name;
                }
                return list;
            }
        }
        private static Dictionary<string, long?> KnownImages = new Dictionary<string, long?>();
        /// <summary>
        /// Returns a bool that represents the image known in the cache if its updated since the last call returns false
        /// </summary>
        public static bool GetCacheingEnabled(string id, long? CurrentImageVersion)
        {
            long? lastImage;
            if (KnownImages.TryGetValue(id, out lastImage))
            {
                if (lastImage == CurrentImageVersion)
                {
                    return true;
                }
                KnownImages[id] = CurrentImageVersion;
                return false;
            }
            else
            {
                KnownImages.Add(id, CurrentImageVersion);
                return false;
            }
        }
        public static async Task<Food> InstertFood(Food food, string ImagePath)
        {

            food = await InstertFood(food);

            if (food?._id != null && ImagePath != null && ImagePath != "")
            {
                var query = new Dictionary<string, object>();
                query.Add("_id", food._id);
                var res = await Networking.Networking.GetRequestSimple("food", query);
                await Networking.Networking.JpegImageUploadWithAuth("foodimage", query, ImagePath);
            }

            return food;
        }
        public static async Task<Food> InstertFood(Food food)
        {
            string FoodText = CreateFoodToServer(food);

            var foodRes = await Networking.Networking.PostRequestWithForceAuth("food", @"{""food"": " + FoodText + "}");

            food = ParseFoodFromServerJson(foodRes.Content);
            return food;
        }
        public static async Task<List<Food>> GetMyFoods()
        {
            var res = await Networking.Networking.GetRequestWithForceAuth("myfoods", new Dictionary<string, object>());
            JToken token = JToken.Parse(res.Content);
            JArray tokenList = token.Value<JArray>("foods");

            List<Food> foods = new List<Food>();
            for (int i = 0; i < tokenList.Count; i++)
            {
                JToken foodToken = tokenList.ElementAt<JToken>(i);
                Food food = ParseFoodFromServerJson(foodToken.ToString(Formatting.None));
                foods.Add(food);
            }
            return foods;
        }
        public async Task SetSubForfood(bool state)
        {
            var query = new Dictionary<string, object>();
            query.Add("_id", _id);
            IRestResponse res;
            if (state)
                res = await Networking.Networking.GetRequestWithForceAuth("sub", query);
            else
                res = await Networking.Networking.GetRequestWithForceAuth("unsub", query);
            return;

        }
        public static async Task<List<Food>> GetSubFoods()
        {
            var res = await Networking.Networking.GetRequestWithForceAuth("subfoods", new Dictionary<string, object>());
            JToken token = JToken.Parse(res.Content);
            JArray tokenList = token.Value<JArray>("foods");

            List<Food> foods = new List<Food>();
            for (int i = 0; i < tokenList.Count; i++)
            {
                JToken foodToken = tokenList.ElementAt<JToken>(i);
                Food food = ParseFoodFromServerJson(foodToken.ToString(Formatting.None));
                foods.Add(food);
            }
            return foods;
        }
        public static async Task<List<IMealingItem>> GetSubAndMyFoods()
        {
            List<Food> foods = await GetMyFoods();
            foods.AddRange(await GetSubFoods());
            List<IMealingItem> items = new List<IMealingItem>();
            foods.ForEach((food) => { items.Add(food as IMealingItem); });
            return items;
        }
        public static async Task<Food> Get(string _id)
        {
            var query = new Dictionary<string, object>();
            query.Add("_id", _id);
            var res = await Networking.Networking.GetRequestSimple("food", query);
            Food food = ParseFoodFromServerJson(res.Content);
            return food;
        }
        /// <summary>
        /// Send delete request for the following id.
        /// </summary>
        /// <param name="id">The id of the food.</param>
        /// <returns>true if success</returns>
        public static async Task<bool> Delete(string id)
        {
            var query = new Dictionary<string, object>();
            query.Add("_id", id);
            var res = await Networking.Networking.DeleteRequestWithForceAuth("food", query);
            if (res.IsSuccessful && res.Content == "success")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public static Food ParseFoodFromServerJson(string json)
        {
            if (json != null && json != "")
            {
                JObject jFood = null;
                try
                {
                    jFood = JObject.Parse(json);
                }
                catch (JsonReaderException e)
                {
                    return null;
                }
                Food food = new Food();

                food._id = jFood.GetValue("_id").Value<string>();
                food.owner = jFood.GetValue("owner").Value<string>();
                food.makeTime = jFood.GetValue("makeTime").Value<int?>();
                food.dose = jFood.GetValue("dose")?.Value<int>() ?? 4;
                food.subcribed = jFood.GetValue("subscribed").Value<bool>();
                food.name = jFood.GetValue("name").Value<string>();
                food.desc = jFood.GetValue("desc").Value<string>();
                food.isPrivate = jFood.GetValue("private")?.Value<bool>() ?? true;
                food.imageURL = jFood.GetValue("image")?.Value<string>();
                food.LastModified = DateTimeExtensions.FromTotalMilis(jFood.GetValue("lastModified")?.Value<long>() ?? 0);
                var tagArray = jFood.GetValue("tags")?.Value<JArray>();
                if (tagArray != null)
                {
                    for (int i = 0; i < tagArray.Count; i++)
                    {
                        string str = tagArray.ElementAt(i).ToObject<string>();
                        food.Tags.Add(Tag.GetTagById(str));
                    }
                }

                food.imageUploaded = jFood.GetValue("imageUploaded")?.Value<long?>();
                JArray jarray = jFood.GetValue("ingredients").Value<JArray>();
                if (jarray != null)
                {
                    food.ingredients = new List<Ingredient>();
                    for (int i = 0; i < jarray.Count; i++)
                    {
                        food.ingredients.Add(Ingredient.ParseIngredient(jarray.ElementAt(i), food));
                    }
                }
                else
                {
                    food.ingredients = new List<Ingredient>();
                }
                return food;
            }
            else
                return null;

        }
        public static string CreateFoodToServer(Food food)
        {
            JObject jFood = new JObject();

            JArray ingArray = new JArray();
            foreach (Ingredient ing in food.ingredients)
            {
                ingArray.Add(Ingredient.CreateIngredientToServer(ing));
            }

            if (food._id != null)
            {
                jFood.Add("_id", JToken.FromObject(food._id));
            }
            jFood.Add("name", JToken.FromObject(food.name));
            jFood.Add("private", JToken.FromObject(food.isPrivate));
            jFood.Add("makeTime", JToken.FromObject(food.makeTime));
            jFood.Add("desc", JToken.FromObject(food.desc));
            jFood.Add("dose", JToken.FromObject(food.dose));

            List<string> strList = new List<string>();
            food.Tags.ForEach((tag) => { strList.Add(tag.ID); });
            jFood.Add("tags", new JArray(strList));
            jFood.Add("ingredients", ingArray);

            return jFood.ToString(Formatting.None);

        }
        public static async Task<IEnumerable<Food>> Search(EFoodSearchType type, uint from, uint to, Dictionary<string, object> args)
        {
            if (args.ContainsKey("from"))
                args["from"] = from;
            else
                args.Add("from", from);

            if (args.ContainsKey("to"))
                args["to"] = to;
            else
                args.Add("to", to);

            switch (type)
            {
                case EFoodSearchType.All:
                    if (args.ContainsKey("type"))
                        args["type"] = "all";
                    else
                        args.Add("type", "all");
                    break;

                case EFoodSearchType.FullText:
                    if (args.ContainsKey("type"))
                        args["type"] = "search";
                    else
                        args.Add("type", "search");
                    break;
                case EFoodSearchType.Custom:
                    break;
                default:
                    return new List<Food>();
            }
            var res = await Networking.Networking.GetRequestSimple("search", args);
            JArray tokenList = JArray.Parse(res.Content);

            List<Food> foods = new List<Food>();
            for (int i = 0; i < tokenList.Count; i++)
            {
                JToken foodToken = tokenList.ElementAt<JToken>(i);
                Food food = ParseFoodFromServerJson(foodToken.ToString(Formatting.None));
                foods.Add(food);
            }
            return foods;

        }
    }
    public enum EFoodSearchType
    {
        FullText,
        All,
        Custom,
    }
}