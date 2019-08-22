using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    public class Key
    {
        [JsonProperty]
        public string key { get; set; }
        [JsonProperty]
        public string type { get; set; }
        [JsonProperty]
        public JObject typeParameter { get; set; }
        [JsonProperty]
        public int maxusings { get; set; }
        [JsonProperty]
        public List<string> logs { get; set; }
        [JsonProperty]
        public List<KeyUsedObject> used { get; set; }
        public async static Task<List<Key>> GetKeys()
        {
            var keys = new List<Key>();
            var res = await Networking.GetRequestWithForceAuth("keys", new Dictionary<string, object>());
            try
            {
                var jarray = JArray.Parse(res.Content);
                for (int i = 0; i < jarray.Count; i++)
                {
                    var key = jarray.ElementAt(i).ToObject<Key>();
                    keys.Add(key);
                }
                return keys;
            }
            catch (JsonReaderException)
            {
                return new List<Key>();
            }
        }
        public async static Task GenerateKeys(string type, JObject parameter, int count, int maxusings)
        {
            var body = new JObject();
            body.Add("type", type);
            body.Add("parameter", parameter);
            body.Add("count", count);
            body.Add("maxusings", maxusings);
            var res = await Networking.PutRequestWithForceAuth("keys", body.ToString(Formatting.None));
            if (res?.Content == "success")
            {
                Cookta.SendNotification("Sikeres generálás", "A kódók generálása sikeres");
            }
            else
            {
                Cookta.SendNotification("Hiba", "Hiba a kódok generálása közben, http válasz: " + res?.Content);
            }
        }
        public async static Task InvalidateKey(string key)
        {
            var query = new Dictionary<string, object>();
            query.Add("key", key);
            var res = await Networking.DeleteRequestWithForceAuth("keys", query);
            if (res?.Content == "success")
            {
                Cookta.SendNotification("Sikeres érvénytelenítés", "A kód többé nem érvényes: " + key);
            }
            else
            {
                Cookta.SendNotification("Hiba", "Hiba a kód érvénytelenítése közben, http válasz: " + res?.Content);
            }
        }
        public async static Task UseKey(string key)
        {
            var query = new Dictionary<string, object>();
            query.Add("key", key);
            var res = await Networking.GetRequestWithForceAuth("key", query);
            if (res?.Content == "success")
            {
                Cookta.SendNotification("Sikeres érvénytelenítés", "A kód többé nem érvényes: " + key);
            }
            else
            {
                Cookta.SendNotification("Hiba", "Hiba a kód érvénytelenítése közben, http válasz: " + res?.Content);
            }
            await OwnUser.RefreshCurrentUserData();
        }
    }
    public class KeyUsedObject
    {
        public string sub { get; set; }
        public long time { get; set; }
    }
}
