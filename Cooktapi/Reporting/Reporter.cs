using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Reporting
{
    public class Reporter
    {
        public static async Task IngredientReport(Dictionary<string, object> query)
        {
            var res = await Networking.Networking.GetRequestSimple("ingredientreport", query);
            if (res.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Cookta.SendNotification("Hiba", "Ismeretlen hiba lépett fel a jelentés küldésekor, ha a hiba nem oldódik meg vedd fel velünk a kapcsolatot.");
            }
            else
            {
                Cookta.SendNotification("Köszönjük a visszajelzés", "A Kért hozzávaló hamarosan bekerül az adatbázisba!");
            }
        }
        public static async Task Report(string subject, string desc, string message)
        {
            var body = new JObject();
            body.Add("subject", subject);
            body.Add("desc", desc);
            body.Add("message", message);
            var res = await Networking.Networking.PostRequestWithForceAuth("report", body.ToString(Formatting.None));
            if (res.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Cookta.SendNotification("Hiba", "Ismeretlen hiba lépett fel a jelentés küldésekor, ha a hiba nem oldódik meg vedd fel velünk a kapcsolatot: webmaster@cookta.online");
            }
            else
            {
                Cookta.SendNotification("Köszönjük a visszajelzés", "");
            }
        }
    }
}
