//using Cooktapi;
//using Cooktapi.Calendar;
//using Cooktapi.Food;
//using Cooktapi.Networking;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using Newtonsoft.Json.Linq;
//using RestSharp;
//using System;
//using System.Collections.Generic;
//using System.Text;
//using System.Threading.Tasks;

//namespace Test.Cooktapi
//{
//    [TestClass]
//    public class CalendarDayTest
//    {

//        public string Token;
//        public Cookta Cookta;


//        [TestInitialize]
//        public async Task InitTest()
//        {
//            Token = GetDebugToken();
//            Cookta = new Cookta(null, null, null, false);
//            await Cookta.Init();
//            User.SetupForTest(Token);
//        }
//        [TestMethod]
//        public async Task CalendarDay_SetGetDayTest()
//        {
//            CalendarDay testDay = new CalendarDay (DateTime.Now);
//            testDay.Mealings[5].items = new List<IMealingItem>() { (await Food.GetLastFoods(1, 50))[0] };
//            await CalendarDay.SaveDay(testDay);

//            var gettedDay = await CalendarDay.GetDay(testDay.DateTime);
//            Assert.IsTrue(gettedDay.Mealings[5].items[0].GetMealFood()._id == testDay.Mealings[5].items[0].GetMealFood()._id);

//            await CalendarDay.SaveDay(new CalendarDay(testDay.DateTime));

//            var deletedDay = await CalendarDay.GetDay(testDay.DateTime);
//            Assert.IsTrue(deletedDay.Mealings[5].items.Count == 0);
//        }
//        private string GetDebugToken()
//        {
//            var client = new RestClient("https://kukta.eu.auth0.com/oauth/token");
//            var request = new RestRequest(Method.POST);
//            request.AddHeader("content-type", "application/json");
//            request.AddParameter("application/json", "{\"client_id\":\"XRKPJAl2CKioPj6WrX4ZjXcrkRkO9xzW\",\"client_secret\":\"a1CBkgCH3X3WLnZXtmy5VWoBQZ2StWRMAoHisju0zwDikrY4rUrSIvKb-3gXU5Zl\",\"audience\":\"https://kuktaservice.azurewebsites.net/\",\"grant_type\":\"client_credentials\"}", ParameterType.RequestBody);
//            IRestResponse response = client.Execute(request);

//            JObject obj = JObject.Parse(response.Content);
//            return obj.GetValue("access_token").Value<string>();
//        }
//    }
//}
