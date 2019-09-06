using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace CooktaServices.Domain.Account
{
    public class User
    {
        public Guid UserId { get; set; }
        public string Email { get; set; }   
        public List<Sub> Subs { get; set; }
        public Role  Role { get; set; }
        public Family CurrentFamily { get; set; }
    }
}