using System;
using System.ComponentModel.DataAnnotations.Schema;
using CooktaServices.Domain.Account;
using CooktaServices.Domain.Receipts;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CooktaServices.Domain.Social
{
    public class Subscription
    {
        [ForeignKey("UserId")]
        public Guid UserId { get; set; }

        public User User { get; set; }
        [ForeignKey("FoodId")]
        public Guid FoodId { get; set; }
        public Food Food { get; set; }
    }
}