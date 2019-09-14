using System;
using System.Collections.Generic;
using CooktaServices.Domain.Receipts;

namespace CooktaServices.Contracts.V1.Requests
{
    public class CreateFoodRequest
    {
        public string Name { get; set; } 
        public List<Ingredient> Ingredients { get; set; }
    }
}