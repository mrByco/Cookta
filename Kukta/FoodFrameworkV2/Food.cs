using Kukta.FrameWork;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public string name;
        public string desc;

        public BitmapImage getImage()
        {
            //Placeholder
            return new BitmapImage(new Uri("https://kuktaimages.blob.core.windows.net/application/Square44x44Logo.altform-unplated_targetsize-256.png?sv=2018-03-28&ss=bqtf&srt=sco&sp=rwdlacup&se=2019-06-28T17:38:34Z&sig=kA%2B8%2FjsZ4LMncIaQVq5d%2FjOOBZ7BgpHxjOAfO9G1eCg%3D&_=1561714723334"
                , UriKind.Absolute));
        }


        /*public static async Task<Food> GetFood(string id)
        {

            Networking.GetRequestSimple()
        }*/
        public static async Task<Food> InsterFood(Food food)
        {
            string FoodText = CreateFoodToServer(food);
            var res = await Networking.PutRequestWithForceAuth("food", @"{""food"": " + FoodText + "}");
            food = ParseFoodFromServerJson(res.Content);
            return food;
        }

        public static async Task<List<Food>> GetMyFoods()
        {
            var res = await Networking.GetRequestWithForceAuth("myfoods", "");
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

            return food;
        }
        public static string CreateFoodToServer(Food food)
        {
            JObject jFood = new JObject();

            if (food._id != null)
            {
                jFood.Add("_id", JToken.FromObject(food._id));
            }
            jFood.Add("name", JToken.FromObject(food.name));
            jFood.Add("makeTime", JToken.FromObject(food.makeTime));
            jFood.Add("desc", JToken.FromObject(food.desc));

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
