using Cooktapi.Calendar;
using Cooktapi.Extensions;
using Cooktapi.Food.Certificate;
using Cooktapi.Measuring;
using Cooktapi.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Food
{
    public class Food : AMealingItem, IIngredientSource
    {
        public string Id;
        public string Owner;
        public int? MakeTime = 0;
        public bool Owning
        {
            get
            {
                return this.Owner == OwnUser.CurrentUser?.Sub;
            }
        }
        public bool Subcribed { get; set; }
        public new int Dose = 4;
        public bool IsPrivate { get; set; }
        public string Name;
        public string Desc;
        public string ImageUrl;
        public IFoodCertificationResult Report;
        public DateTime LastModified { get; private set; }
        public long? ImageUploaded { get; private set; }
        public ObservableCollection<Tag> Tags = new ObservableCollection<Tag>();
        public ObservableCollection<Tag> AutoTags = new ObservableCollection<Tag>();
        public List<Ingredient> Ingredients = new List<Ingredient>();
        public override Food GetMealFood() { return this; }
        public Food This => this;
        public override string GetId() { return Id; }

        public override void NewSeed() { return; }
        public override string GetName() { return Name; }
        public EFoodPublicState FoodPublicState { get; set; }

        public Uri GetImage
        {
            get
            {
                if (!string.IsNullOrEmpty(ImageUrl))
                {
                    var bitmapUri = new Uri(ImageUrl.ToString(), UriKind.Absolute);
                    return bitmapUri;
                }
                return new Uri("https://kuktaimages.blob.core.windows.net/application/Square44x44Logo.altform-unplated_targetsize-256.png", UriKind.Absolute);
            }
        }
        public override string ToString()
        {
            return Name;
        }


        public string GetIngredientArray
        {
            get
            {
                string list = "";
                foreach (Ingredient ing in Ingredients)
                {
                    if (list.Length > 0)
                        list = list + ", ";
                    list = list + ing.Type.Name;
                }
                return list;
            }
        }

        public List<Ingredient> GetIngredientsForDose(float dose)
        {
            var multipled = new List<Ingredient>();
            Ingredients.ForEach(ing =>
            {
                var newIng = new Ingredient(ing.Type, (ing.Value / this.Dose) * dose, ing.Unit, ing.InheritedFrom);
                if (newIng.Unit.Type == UnitType.Count)
                {
                    newIng.Value = (int)Math.Ceiling(newIng.Value);
                }

                multipled.Add(newIng);
            });
            return multipled;
        }
        private static readonly Dictionary<string, long?> _knownImages = new Dictionary<string, long?>();
        /// <summary>
        /// Returns a bool that represents the image known in the cache if its updated since the last call returns false
        /// </summary>
        public static bool GetCacheingEnabled(string id, long? currentImageVersion)
        {
            long? lastImage;
            if (_knownImages.TryGetValue(id, out lastImage))
            {
                if (lastImage == currentImageVersion)
                {
                    return true;
                }
                _knownImages[id] = currentImageVersion;
                return false;
            }
            else
            {
                _knownImages.Add(id, currentImageVersion);
                return false;
            }
        }
        public static async Task<Food> InstertFood(Food food, string imagePath)
        {

            food = await InstertFood(food);

            if (food?.Id != null && imagePath != null && imagePath != "")
            {
                var query = new Dictionary<string, object>();
                query.Add("_id", food.Id);
                var res = await Networking.Networking.GetRequestSimple("food", query);
                await Networking.Networking.JpegImageUploadWithAuth("foodimage", query, imagePath);
            }

            return food;
        }
        public static async Task<Food> InstertFood(Food food)
        {
            string foodText = CreateFoodToServer(food).ToString(Formatting.None);

            var foodRes = await Networking.Networking.PostRequestWithForceAuth("food", @"{""food"": " + foodText + "}");

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
            query.Add("_id", Id);
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
        public static async Task<Food> Get(string id)
        {
            var query = new Dictionary<string, object> { { "_id", id } };
            var res = await Networking.Networking.GetRequestSimple("food", query);
            var food = ParseFoodFromServerJson(res.Content);
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
            if (!string.IsNullOrEmpty(json))
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

                food.Id = jFood.GetValue("_id").Value<string>();
                food.Owner = jFood.GetValue("owner").Value<string>();
                food.MakeTime = jFood.GetValue("makeTime").Value<int?>();
                food.Dose = jFood.GetValue("dose")?.Value<int>() ?? 4;
                food.Subcribed = jFood.GetValue("subscribed").Value<bool>();
                food.Name = jFood.GetValue("name").Value<string>();
                food.Desc = jFood.GetValue("desc").Value<string>();
                food.IsPrivate = jFood.GetValue("private")?.Value<bool>() ?? true;
                food.ImageUrl = jFood.GetValue("image")?.Value<string>();

                var isPublic = jFood.GetValue("published")?.Value<bool>() ?? false;
                if (food.IsPrivate)
                    food.FoodPublicState = EFoodPublicState.Private;
                else if (!isPublic)
                    food.FoodPublicState = EFoodPublicState.Pending;
                else
                    food.FoodPublicState = EFoodPublicState.Public;

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
                var generatedTagArray = jFood.SelectToken("$.generated.tags")?.Value<JArray>();
                if (generatedTagArray != null)
                {
                    for (int i = 0; i < generatedTagArray.Count; i++)
                    {
                        var tag = Tag.ParseTag(generatedTagArray.ElementAt(i).ToString());
                        food.AutoTags.Add(tag);
                    }
                }

                food.ImageUploaded = jFood.GetValue("imageUploaded")?.Value<long?>();
                JArray jarray = jFood.GetValue("ingredients").Value<JArray>();
                if (jarray != null)
                {
                    food.Ingredients = new List<Ingredient>();
                    for (int i = 0; i < jarray.Count; i++)
                    {
                        food.Ingredients.Add(Ingredient.ParseIngredient(jarray.ElementAt(i), food));
                    }
                }
                else
                {
                    food.Ingredients = new List<Ingredient>();
                }

                //certification report
                if (jFood.GetValue("lastCertificate") != null)
                {
                    if (jFood.GetValue("lastCertificate").Value<string>("type") == "admin")
                        food.Report = jFood.SelectToken("$.lastCertificate.certificationReport").ToObject<FoodCertificationReport>();
                    else
                        food.Report = new PendingCertifiacte();
                }
                return food;
            }
            else
                return null;

        }
        public static async Task UploadCertForFood(Food food, FoodCertificationReport report, ECertificationType certType)
        {
            string cert;
            if (certType == ECertificationType.Admin)
                cert = "admin";
            else if (certType == ECertificationType.User3)
                cert = "user3";
            else
                return;
            var certification = new JObject();
            certification.Add("type", cert);
            certification.Add("food", CreateFoodToServer(food));
            certification.Add("certificationReport", JToken.FromObject(report));
            var body = certification.ToString();
            var res = await Networking.Networking.PostRequestWithForceAuth("certification", body);
            return;
        }
        public static JObject CreateFoodToServer(Food food)
        {
            JObject jFood = new JObject();

            JArray ingArray = new JArray();
            foreach (Ingredient ing in food.Ingredients)
            {
                ingArray.Add(Ingredient.CreateIngredientToServer(ing));
            }

            if (food.Id != null)
            {
                jFood.Add("_id", JToken.FromObject(food.Id));
            }
            jFood.Add("name", JToken.FromObject(food.Name));
            jFood.Add("private", JToken.FromObject(food.IsPrivate));
            jFood.Add("makeTime", JToken.FromObject(food.MakeTime));
            jFood.Add("desc", JToken.FromObject(food.Desc));
            jFood.Add("dose", JToken.FromObject(food.Dose));

            List<string> strList = new List<string>();
            foreach (Tag tag in food.Tags)
            {
                strList.Add(tag.ID);
            }
            jFood.Add("tags", new JArray(strList));
            jFood.Add("ingredients", ingArray);

            return jFood;

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
    public enum ECertificationType
    {
        User3,
        Admin
    }
    public enum EFoodPublicState
    {
        Private,
        Public,
        Pending
    }
    public enum EFoodSearchType
    {
        FullText,
        All,
        Custom,
    }
}