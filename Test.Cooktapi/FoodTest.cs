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
using Kukta.Food;

namespace Test.Cooktapi
{
    [TestClass]
    public class FoodTest
    {
        public string Token;
        public Cookta Cookta;

        public const string TestServerFoodString = "{\"_id\":\"5d3960fdeb6dc500360d6ab7\",\"owner\":\"windowslive|c8522667fa96a7ff\",\"name\":\"Paradicsomos káposzta\",\"makeTime\":0,\"dose\":4,\"desc\":\"Az apróra vágott káposztát és vöröshagymát egy fazékba tesszük, felöntjük a paradicsomlével és fél liter vízzel, beletesszük a babérlevelet, sót, őrölt köménymagot és 30-60 percig főzzük, attól függően, hogy mennyire ropogósan szeretjük a káposztát. Az olajon a liszttel világos rántást készítünk, felengedjük vízzel és a káposztába keverjük. 5 percig összefőzzük, tálaljuk.\",\"private\":false,\"tags\":[\"fozelek\",\"zoldseg\",\"paradicsomos\",\"klasszikus\"],\"ingredients\":[{\"ingredientID\":\"e74d3104-1160-49d8-8428-ab686cb8311a\",\"unit\":\"dkg\",\"value\":80},{\"ingredientID\":\"78ca956a-88fa-453f-b4ed-f924f2f8f8f8\",\"unit\":\"head\",\"value\":1},{\"ingredientID\":\"389da597-848a-4751-92bc-1e2b83aaab9b\",\"unit\":\"l\",\"value\":0.8},{\"ingredientID\":\"f3a61bd7-a656-488f-b776-63a2fcee6b3b\",\"unit\":\"l\",\"value\":0.5},{\"ingredientID\":\"27e818fc-3b5a-4965-9aa0-20d817208c9b\",\"unit\":\"db\",\"value\":4},{\"ingredientID\":\"afe13ec2-9f22-48ce-b658-37e1489fdc46\",\"unit\":\"teaspoon\",\"value\":1},{\"ingredientID\":\"d133d8f7-4a19-4cda-baeb-62cb519923b0\",\"unit\":\"teaspoon\",\"value\":1},{\"ingredientID\":\"ff24aab3-c0ad-4180-8f1a-7cbbb019d0e0\",\"unit\":\"c0b7dea3-3062-4b3e-822a-d68553169ab3\",\"value\":2},{\"ingredientID\":\"ac482c40-66f0-4ebe-b701-a936ba54cff7\",\"unit\":\"tablespoon\",\"value\":3},{\"ingredientID\":\"45b0d523-bff3-4c1d-bed1-7461253b3bf0\",\"unit\":\"b91857c2-b5cd-4db8-bfa1-e0e131ee280a\",\"value\":4},{\"ingredientID\":\"f3a61bd7-a656-488f-b776-63a2fcee6b3b\",\"unit\":\"dl\",\"value\":2}],\"imageUploaded\":1564041660227,\"uploaded\":1564495777936,\"lastModified\":1564664540040,\"subscribed\":false,\"liked\":false,\"image\":\"https://kuktaimages.blob.core.windows.net/foodimages/5d3960fdeb6dc500360d6ab7.jpg\"}";
        public const string TestServerFoodStringFailed = "";
        public const string TestServerFoodStringRandom = "error";

        [TestInitialize]
        public async Task InitTest()
        {
            Token = GetDebugToken();
            Cookta = new Cookta(null, null, null, false);
            await Cookta.Init();
            User.SetupForTest(Token);
        }
        [TestMethod]
        public void ServerFoodParseTest_CorrectFood()
        {
            Food food = Food.ParseFoodFromServerJson(TestServerFoodString);
            Assert.IsTrue(
                food.isPrivate = true &&
                food.GetName() == "Paradicsomos káposzta");
        }
        [TestMethod]
        public void ServerFoodParseTest_RandomString()
        {
            Food food = Food.ParseFoodFromServerJson(TestServerFoodStringFailed);
            Assert.IsNull(food);
        }
        [TestMethod]
        public void ServerFoodParseTest_EmptyString()
        {
            Food food = Food.ParseFoodFromServerJson(TestServerFoodStringRandom);
            Assert.IsNull(food);

        }

        private string GetDebugToken()
        {
            var client = new RestClient("https://kukta.eu.auth0.com/oauth/token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", "{\"client_id\":\"XRKPJAl2CKioPj6WrX4ZjXcrkRkO9xzW\",\"client_secret\":\"a1CBkgCH3X3WLnZXtmy5VWoBQZ2StWRMAoHisju0zwDikrY4rUrSIvKb-3gXU5Zl\",\"audience\":\"https://kuktaservice.azurewebsites.net/\",\"grant_type\":\"client_credentials\"}", ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            JObject obj = JObject.Parse(response.Content);
            return "Bearer " + obj.GetValue("access_token").Value<string>();
        }
    }
}
