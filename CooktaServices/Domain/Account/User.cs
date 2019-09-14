using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CooktaServices.Domain.Receipts;
using Microsoft.AspNetCore.Identity;

namespace CooktaServices.Domain.Account
{
    public class User
    {
        [Key]
        public Guid UserId { get; set; }
        public string Email { get; set; }  
        public string DisplayName { get; set; }
        public string Picture { get; set; }
        public DateTime Joined { get; set; }
        public List<Sub> Subs { get; set; }
        public Role  Role { get; set; }
        public Family CurrentFamily { get; set; }
    }
}