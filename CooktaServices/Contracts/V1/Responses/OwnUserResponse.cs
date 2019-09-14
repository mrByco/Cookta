using System;
using System.Collections.Generic;
using CooktaServices.Domain.Account;
using CooktaServices.Domain.Receipts;

namespace CooktaServices.Contracts.V1.Responses
{
    public class OwnUserResponse
    {
        public OwnUserResponse(User user)
        {
            UserId = user.UserId;
            Email = user.Email;
            DisplayName = user.DisplayName;
            Picture = user.Picture;
            Joined = user.Joined;
            Role = user.Role;
            CurrentFamily = user.CurrentFamily;
        }

        public Guid UserId { get; set; }
        public string Email { get; set; }  
        public string DisplayName { get; set; }
        public string Picture { get; set; }
        public DateTime Joined { get; set; }
        public Role  Role { get; set; }
        public Family CurrentFamily { get; set; }
    }
}