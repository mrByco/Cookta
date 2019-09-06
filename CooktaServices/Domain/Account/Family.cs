using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CooktaServices.Domain.Account
{
    public class Family
    {
        public List<User> MemberUsers { get; set; }
        public DateTime Created { get; set; }
        public string Name { get; set; }
    }
}
