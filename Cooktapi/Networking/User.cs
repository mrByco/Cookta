using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    public class User
    {
        public string DisplayName { get; protected set; }
        public string ProfilPic { get; protected set; }
        public string Sub { get; protected set; }

        public async static Task<User> GetUser(string sub)
        {
            var query = new Dictionary<string, object>();
            query.Add("user", sub);
            var response = await Networking.GetRequestSimple("userdata", query);
            JObject jUser;
            try
            {
                jUser = JObject.Parse(response.Content);
            }
            catch (JsonReaderException)
            {
                return null;
            }

            User user = new User();
            user.DisplayName = jUser.Value<string>("username");
            user.ProfilPic = jUser.Value<string>("profilpic");
            user.Sub = jUser.Value<string>("sub");
            return user;
        }
    }
    public class ExpandedUser
    {
        [JsonProperty]
        public string _id { get; set; }
        [JsonProperty]
        public string username { get; set; }
        [JsonProperty]
        public string email { get; set; }
        [JsonProperty]
        public string sub { get; set; }
        [JsonProperty]
        public string profilpic { get; set; }
        [JsonProperty]
        public string role { get; set; }

        public async static Task<List<ExpandedUser>> GetUsers()
        {
            var Users = new List<ExpandedUser>();
            var res = await Networking.GetRequestWithForceAuth("users", new Dictionary<string, object>());
            try
            {
                var jarray = JArray.Parse(res.Content);
                for (int i = 0; i < jarray.Count; i++)
                {
                    var user = jarray.ElementAt(i).ToObject<ExpandedUser>();
                    Users.Add(user);
                }
                return Users;
            }
            catch (JsonReaderException)
            {
                return new List<ExpandedUser>();
            }
        }
        public async static Task SetUserRole(string sub, Role role)
        {
            var body = new JObject();
            body.Add("user", sub);
            body.Add("role", role.roleID);
            var res = await Networking.PutRequestWithForceAuth("userrole", body.ToString(Formatting.None));
            if (res?.Content == "success")
            {
                Cookta.SendNotification("Sikeres roleváltoztatás", "");
            }
            else
            {
                Cookta.SendNotification("Hiba", "Hiba a roleváltoztatás közben, http válasz: " + res?.Content);
            }
            return;
        }

    }
    public class UserLog
    {

    }
}
