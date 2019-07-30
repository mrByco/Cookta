using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FrameWork
{
    public class Role
    {
        public static async Task<bool> HasPermission(string permission)
        {
            if (Networking.aResult?.AccessToken != null)
            {
                var query = new Dictionary<string, object>();
                query.Add("permission", permission);
                var res = await Networking.GetRequestWithForceAuth("haspermission", query);
                bool has;
                if (Boolean.TryParse(res.Content, out has))
                {
                    return has;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        public static async Task<List<string>> GetPermissions()
        {
            List<string> permissions = new List<string>();
            var response = await Networking.GetRequestWithForceAuth("mypermissions", null);
            if (response.Content != null && response.Content != "" && response.StatusCode != System.Net.HttpStatusCode.NotFound)
            {
                JArray jarray = JArray.Parse(response.Content);
                for (int i = 0; i < jarray.Count; i++)
                {
                    permissions.Add(jarray.ElementAt(i).Value<string>());
                }
            }
            return permissions;
        }
    }
}
