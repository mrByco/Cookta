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
    public class Food
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
        public List<Ingredient> ingredients = new List<Ingredient>();

        public BitmapImage getImage()
        {
            if (imageURL != null && imageURL != "")
            {
                var bitmapImage = new BitmapImage(new Uri(imageURL.ToString(), UriKind.RelativeOrAbsolute));
                bitmapImage.CreateOptions = BitmapCreateOptions.IgnoreImageCache;
                return bitmapImage;
            }
            return new BitmapImage(new Uri("https://kuktaimages.blob.core.windows.net/application/Square44x44Logo.altform-unplated_targetsize-256.png"
                , UriKind.Absolute));
        }


        /*public static async Task<Food> GetFood(string id)
        {

            Networking.GetRequestSimple()
        }*/
        public static async Task<Food> InsterFood(Food food, StorageFile Image)
        {
            string FoodText = CreateFoodToServer(food);

            var foodRes = await Networking.PostRequestWithForceAuth("food", @"{""food"": " + FoodText + "}");

            food = ParseFoodFromServerJson(foodRes.Content);

            if (foodRes.StatusCode == System.Net.HttpStatusCode.OK && Image != null)
                await Networking.JpegImageUploadWithAuth("foodimage", food._id, Image);

            return food;
        }

        public static async Task<List<Food>> GetMyFoods()
        {
            var res = await Networking.GetRequestWithForceAuth("myfoods", "");

            if (res.StatusCode == 0)
            {
                MainPage.instance.ShowServiceError();
                return null;
            }
            var json = (res.Content);
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

        internal static async Task<Food> Get(string _id)
        {
            var res = await Networking.GetRequestSimple("food", _id);
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
            var res = Networking.DeleteRequestWithForceAuth("food", id);
            if (res.Result.IsSuccessful && res.Result.Content == "success")
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
