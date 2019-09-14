using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CooktaServices.Domain.Account;

namespace CooktaServices.Domain.Receipts
{
    public class Food
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public User Owner { get; set; }
        public List<Ingredient> Ingredients { get; set; }

    }
}
