using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FrameWork
{
    public class Role
    {
        public readonly string Id;
        public readonly string DisplayName;
        public readonly List<string> Permissions;
        public static Role GetRole(string id)
        {
            Role role = roles.Find((r) => { return r.Id == id; });
            return role ?? DefaultRole;
        }
        public Role(List<string> permissions, string id, string displayName)
        {
            Id = id;
            Permissions = permissions;
            DisplayName = displayName;
        }
        public bool HasPermission(string permission)
        {
            return this.Permissions.Contains(permission);
        }
        public static List<Role> roles = new List<Role>()
        {
            new Role(new List<string>(){ "manage-roles", "manage-ingredients", "manage-ingredient-reports", "manage-others-online-receipts", "subcribe-receipts", "use-calendar", "upload-public-receipts-immidiatelly"},
                "owner", "Tulajdonos"),
            new Role(new List<string>(){ "manage-ingredients", "manage-ingredient-reports", "manage-others-online-receipts", "subcribe-receipts", "use-calendar", "upload-public-receipts-immidiatelly"},
                "dev", "Fejlesztő"),
            new Role(new List<string>(){ "subcribe-receipts", "use-calendar", "upload-public-receipts-immidiatelly"},
                "gold-test", "Arany tesztelő"),
        };
        public static Role DefaultRole
        {
            get
            {
                return new Role(new List<string>() { "subcribe-receipts" },
                    "", "Felhasználló");
            }
        }
    }
}
