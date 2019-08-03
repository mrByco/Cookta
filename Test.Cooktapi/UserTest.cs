using Cooktapi;
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
            User.SetupForTest(Token);
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
            Assert.IsNotNull(User.DisplayName);
        }
        [TestMethod]
        public async Task Test_UserNameValidation_CharacterCount()
        {
            var errors = await User.ValidateUsername("AB");
            errors.AddRange(await User.ValidateUsername("OpTim4l" + new Random().Next(999)));
            errors.AddRange (await User.ValidateUsername("Fifteen character long username"));
            Assert.IsTrue(errors.Count == 2, "Error count is: " + errors.Count);
        }
        [TestMethod]
        public async Task Test_UserNameValidation_Availability()
        {
            var errors = await User.ValidateUsername(User.DisplayName);
            Assert.IsTrue(errors.Count == 1);
        }
        [TestMethod]
        public async Task Test_ChangeTheUserName_FailIfUsernameNotChanged()
        {
            string oldName = User.DisplayName;
            await User.ChangeUserName("N" + oldName);
            Assert.AreNotEqual(oldName, User.DisplayName);

            //Restore the old name
            await User.ChangeUserName(oldName);
            Assert.AreEqual(oldName, User.DisplayName);
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
