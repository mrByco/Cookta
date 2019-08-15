using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
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
}
