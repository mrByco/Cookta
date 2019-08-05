using Cooktapi;
using Cooktapi.Food;
using Cooktapi.Networking;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Threading.Tasks;

namespace Test.Cooktapi
{


    [TestClass]
    public class IngredientTypeTest
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
        public void TestIngredientTypesDownloaded_ErrorIfTypesCountLessThen5()
        {
            var types = IngredientType.Types;
            Assert.IsTrue(types.Count > 5);
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
