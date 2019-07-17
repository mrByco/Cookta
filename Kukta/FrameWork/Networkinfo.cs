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
    }
}
