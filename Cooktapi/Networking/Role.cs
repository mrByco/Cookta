using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    public class Role
    {
        [JsonProperty]
        public string roleID { get; set; }
        [JsonProperty]
        public string displayName { get; set; }
        [JsonProperty]
        public List<string> permissions { get; set; }
        public Role()
        {
            permissions = new List<string>();
        }

        public override string ToString()
        {
            return displayName;
        }

        public async static Task<List<Role>> GetRoles()
        {
            var roles = new List<Role>();
            var res = await Networking.GetRequestWithForceAuth("roles", new Dictionary<string, object>());
            try
            {
                var jarray = JArray.Parse(res.Content);
                for (int i = 0; i < jarray.Count; i++)
                {
                    var role = jarray.ElementAt(i).ToObject<Role>();
                    roles.Add(role);
                }
                return roles;
            }
            catch (JsonReaderException)
            {
                return new List<Role>();
            }
        }
        public async static Task UpdateRole(Role role)
        {
            var body = JObject.FromObject(role).ToString(Formatting.None);
            var res = await Networking.PostRequestWithForceAuth("role", body);
            return;
        }
    }
}
