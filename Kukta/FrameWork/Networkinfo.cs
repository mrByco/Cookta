using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FrameWork
{
    public class Networkinfo
    {
        public readonly string DisplayName;
        public readonly string Role;
        public readonly string WinID;
        public readonly string Email;
        public readonly string ProfilPic;

        public Networkinfo(string displayName, string role, string winID, string email, string profilpic)
        {
            DisplayName = displayName;
            Role = role;
            WinID = winID;
            Email = email;
            ProfilPic = profilpic;
        }
        public static Networkinfo FromJson(string str)
        {
            Networkinfo info = null;
            try
            {
                var infoJObj = JObject.Parse(str);
                var displayName = infoJObj.Value<string>("username");
                var winid = infoJObj.Value<string>("winid");
                var role = infoJObj.Value<string>("role");
                var email = infoJObj.Value<string>("email");
                var profilpic = infoJObj.Value<string>("profilpic");
                info = new Networkinfo(displayName, role, winid, email, profilpic);
            }
            catch
            {
                info = null;
            }
            return info;
        }
    }
}
