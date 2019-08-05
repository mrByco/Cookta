using Cooktapi;
using Cooktapi.Networking;
using Cooktapi.Food;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Test.Cooktapi
{
    [TestClass]
    public class FoodTest
    {
        public string Token;
        public Cookta Cookta;


        [TestInitialize]
        public async Task InitTest()
        {
            Token = GetDebugToken();
            Cookta = new Cookta(null, null, null, false);
            await Cookta.Init();
            User.SetupForTest(Token);
        }
        [TestMethod]
        public async Task UploadFoodTest_UploadFoodWithoutPicture()
        {
            Food newFood = new Food();
            newFood.dose = 4;
            newFood.name = "Testfood123";
            newFood.desc = "Testfood desc 123.";
            newFood.isPrivate = true;
            newFood.Tags.Add(Tag.Tags[((new Random()).Next(Tag.Tags.Count - 1))]);
            newFood.Tags.Add(Tag.Tags[((new Random()).Next(Tag.Tags.Count - 1))]);

            var insertedFood = await Food.InstertFood(newFood);
            Assert.AreEqual(newFood.dose, insertedFood.dose);
            Assert.AreEqual(newFood.name, insertedFood.name);
            Assert.AreEqual(newFood.desc, insertedFood.desc);
            Assert.AreEqual(newFood.Tags.Count, insertedFood.Tags.Count);
            Assert.IsNotNull(insertedFood._id);
            Assert.IsNotNull(insertedFood.owner);

            //try get food
            var downloadedFood = await Food.Get(insertedFood._id);
            Assert.AreEqual(downloadedFood.dose, insertedFood.dose);
            Assert.AreEqual(downloadedFood.name, insertedFood.name);
            Assert.AreEqual(downloadedFood.desc, insertedFood.desc);
            Assert.AreEqual(downloadedFood.Tags.Count, insertedFood.Tags.Count);
            Assert.AreEqual(downloadedFood.owner, insertedFood.owner);
            Assert.AreEqual(downloadedFood._id, insertedFood._id);

            //delete food

            await Food.Delete(downloadedFood._id);
            var nullFood = await Food.Get(downloadedFood._id);
            Assert.IsNull(nullFood);
        }

        private string GetDebugToken()
        {
            var client = new RestClient("https://kukta.eu.auth0.com/oauth/token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", "{\"client_id\":\"XRKPJAl2CKioPj6WrX4ZjXcrkRkO9xzW\",\"client_secret\":\"a1CBkgCH3X3WLnZXtmy5VWoBQZ2StWRMAoHisju0zwDikrY4rUrSIvKb-3gXU5Zl\",\"audience\":\"https://kuktaservice.azurewebsites.net/\",\"grant_type\":\"client_credentials\"}", ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            JObject obj = JObject.Parse(response.Content);
            return obj.GetValue("access_token").Value<string>();
        }
    }
}
