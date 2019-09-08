using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CooktaServices.Domain.Account
{
    public class Family
    {

        [Key]
        public Guid Id { get; set; }
        public List<FamilyMember> MemberUserIds { get; set; }
        public DateTime Created { get; set; }
        public string Name { get; set; }
    }
}
