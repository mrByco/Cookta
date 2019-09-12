﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CooktaServices.Domain.Account
{
    public class FamilyMember
    {
        [Key]
        public Guid Id { get; set; }

        public FamilyMembershipType Type { get; set; }
        [ForeignKey("FamilyId")]
        public Family Family { get; set; }
        public Guid FamilyId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public Guid UserId { get; set; }
    }

    public enum FamilyMembershipType
    {
        Child = 0,
        Member = 1,
        Owner = 5
    }
}
