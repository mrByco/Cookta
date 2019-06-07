using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Cloud
{
    class AccountManager : ASingleton<AccountManager>
    {
        public bool IsLoggedIn;
    }
}
