using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CooktaServices.Domain.Receipts
{
    public class Food
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Ingredient> Ingredients { get; set; }

    }
}
