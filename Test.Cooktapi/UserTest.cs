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
    public class UserTest
    {
        public string Token;
        public Cookta Cookta;
        [TestInitialize]
        public async Task InitTest()
        {
            Token = GetDebugToken();
            Cookta = new Cookta(null, null, null, false);
            await Cookta.Init();
            OwnUser.SetupForTest(Token);
        }
        [TestMethod]
        public void CheckTokenNotNull_FailIfTokenNull()
        {
            string token = Token;
            Assert.IsNotNull(token);
        }
        [TestMethod]
        public void SetupUser_FailIfUserDataFailedAfterInitAsync()
        {
            Assert.IsNotNull(OwnUser.DisplayName);
        }
        [TestMethod]
        public async Task Test_UserNameValidation_CharacterCount()
        {
            var errors = await OwnUser.ValidateUsername("AB");
            errors.AddRange(await OwnUser.ValidateUsername("OpTim4l" + new Random().Next(999)));
            errors.AddRange (await OwnUser.ValidateUsername("Fifteen character long username"));
            Assert.IsTrue(errors.Count == 2, "Error count is: " + errors.Count);
        }
        [TestMethod]
        public async Task Test_UserNameValidation_Availability()
        {
            var errors = await OwnUser.ValidateUsername(OwnUser.DisplayName);
            Assert.IsTrue(errors.Count == 1);
        }
        [TestMethod]
        public async Task Test_ChangeTheUserName_FailIfUsernameNotChanged()
        {
            string oldName = OwnUser.DisplayName;
            await OwnUser.ChangeUserName("N" + oldName);
            Assert.AreNotEqual(oldName, OwnUser.DisplayName);

            //Restore the old name
            await OwnUser.ChangeUserName(oldName);
            Assert.AreEqual(oldName, OwnUser.DisplayName);
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
