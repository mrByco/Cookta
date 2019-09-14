using System;
using System.Collections.Generic;
using CooktaServices.Domain.Account;

namespace CooktaServices.Contracts.V1.Responses
{
    public class PublicUserResponse
    {
        private string DisplayName { get; set; }
        private string Picture { get; set; }
        private DateTime Joined { get; set; }

        public PublicUserResponse(User user)
        {
            DisplayName = user.DisplayName;
            Picture = user.Picture;
            Joined = user.Joined;
        }
    }
}