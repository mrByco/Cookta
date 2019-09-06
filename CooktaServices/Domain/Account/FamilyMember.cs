using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CooktaServices.Domain.Account
{
    public class FamilyMember
    {
        public Guid FamilyId { get; set; }
        public Guid UserId { get; set; }
    }
}
