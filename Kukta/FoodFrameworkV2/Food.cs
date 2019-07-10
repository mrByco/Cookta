using Kukta.Calendar;
using Kukta.FrameWork;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media.Imaging;

namespace Kukta.FoodFrameworkV2
{
    public class Food : IMealingItem
    {
        public string _id;
        public string owner;
        public int? makeTime = 0;
        public bool owning
        {
            get
            {
                return this.owner == Networking.GetClaim("sub");
            }
        }
        public bool subcribed;
        public bool liked;
        public bool isPrivate;
        public string name;
        public string desc;
        public string imageURL;
        private long? imageUploaded;
        public List<Ingredient> ingredients = new List<Ingredient>();

        public Food GetMealFood() { return this; }
        public string GetId() { return _id; }
        public void NewSeed() { return; }
        public string GetName() { return name; }

        public BitmapImage getImage
        {
            get
            {
                if (imageURL != null && imageURL != "")
                {
                    var bitmapImage = new BitmapImage(new Uri(imageURL.ToString(), UriKind.RelativeOrAbsolute));
                    if (!GetCacheingEnabled(_id, imageUploaded))
                        bitmapImage.CreateOptions = BitmapCreateOptions.IgnoreImageCache;
                    return bitmapImage;
                }
                return new BitmapImage(new Uri("https://kuktaimages.blob.core.windows.net/application/Square44x44Logo.altform-unplated_targetsize-256.png"
                    , UriKind.Absolute));
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
        private static bool GetCacheingEnabled(string id, long? CurrentImageVersion)
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

        public static async Task<Food> InsterFood(Food food, StorageFile Image)
        {
            string FoodText = CreateFoodToServer(food);

            var foodRes = await Networking.PostRequestWithForceAuth("food", @"{""food"": " + FoodText + "}");

            food = ParseFoodFromServerJson(foodRes.Content);

            if (foodRes.StatusCode == System.Net.HttpStatusCode.OK && Image != null)
            {
                var query = new Dictionary<string, object>();
                query.Add("_id", food._id);
                var res = await Networking.GetRequestSimple("food", query);
                await Networking.JpegImageUploadWithAuth("foodimage", query, Image);
            }

            return food;
        }

        public static async Task<List<Food>> GetLastFoods(int page, int itemsPerPage)
        {
            var res = await Networking.GetRequestSimple("foods", new Dictionary<string, object>());
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
        public static async Task<bool?> SetSubForfood(string foodID, bool state)
        {
            var query = new Dictionary<string, object>();
            query.Add("_id", foodID);
            var res = state ? await Networking.GetRequestWithForceAuth("sub", query) : await Networking.GetRequestWithForceAuth("unsub", query);
            if (res.Content == "success")
            {
                return state;
            }
            return null;
        }

        public static async Task<List<Food>> GetMyFoods()
        {
            var res = await Networking.GetRequestWithForceAuth("myfoods", new Dictionary<string, object>());
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
        public static async Task<List<Food>> GetSubFoods()
        {
            var res = await Networking.GetRequestWithForceAuth("subfoods", new Dictionary<string, object>());
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

        internal static async Task<Food> Get(string _id)
        {
            var query = new Dictionary<string, object>();
            query.Add("_id", _id);
            var res = await Networking.GetRequestSimple("food", query);
            Food food = ParseFoodFromServerJson(res.Content);
            return food;
        }
        /// <summary>
        /// Send delete request for the following id.
        /// </summary>
        /// <param name="id">The id of the food.</param>
        /// <returns>true if success</returns>
        internal static async Task<bool> Delete(string id)
        {
            var query = new Dictionary<string, object>();
            query.Add("_id", id);
            var res = await Networking.DeleteRequestWithForceAuth("food", query);
            if (res.IsSuccessful && res.Content == "success")
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        private static Food ParseFoodFromServerJson(string json)
        {
            JObject jFood = JObject.Parse(json);
            Food food = new Food();

            food._id = jFood.GetValue("_id").Value<string>();
            food.owner = jFood.GetValue("owner").Value<string>();
            food.makeTime = jFood.GetValue("makeTime").Value<int?>();
            food.subcribed = jFood.GetValue("subscribed").Value<bool>();
            food.liked = jFood.GetValue("liked").Value<bool>();
            food.name = jFood.GetValue("name").Value<string>();
            food.desc = jFood.GetValue("desc").Value<string>();
            bool? nullablePrivate = jFood.GetValue("private")?.Value<bool?>();
            food.isPrivate = nullablePrivate != null ? (bool)nullablePrivate : true;
            food.imageURL = jFood.GetValue("image")?.Value<string>();
            food.imageUploaded = jFood.GetValue("imageUploaded")?.Value<long?>();
            JArray jarray = jFood.GetValue("ingredients").Value<JArray>();
            if (jarray != null)
            {
                food.ingredients = new List<Ingredient>();
                for (int i = 0; i < jarray.Count; i++)
                {
                    string IngID = jarray.ElementAt(i).Value<string>("ingredientID");
                    string UnitName = jarray.ElementAt(i).Value<string>("unit");
                    double Value = jarray.ElementAt(i).Value<double>("value");
                    food.ingredients.Add(new Ingredient(IngredientType.GetByID(IngID), Value, UnitName));
                }
            }
            else
            {
                food.ingredients = new List<Ingredient>();
            }

            return food;
        }
        public static string CreateFoodToServer(Food food)
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


    class FoodUploadObejct
    {
        public string name;
        public string desc;
        public string IsPrivate;
        public int makeTime;
    }
    class FoodDocument
    {
        public string _id;
        public bool subcribed;
        public bool owning;
        public string author;
        public string name;
        public string desc;
        public string IsPrivate;
        public int makeTime;
    }

    /*
     * {
     *      {
     *          "_id":"5d0faff36881d40d9006815f",
     *          "owner":"google-oauth2|115350606162190832995",
     *          "name":"new renamed 0000",
     *          "makeTime":null,"desc":"string",
     *          "ingredients":
     *              [
     *              {"ingredientID":"string","unit":"string","value":0.5},
     *              {"ingredientID":"string2","unit":"string2","value":1.5}
     *              ]
     *              }
     *              }
     */

}
