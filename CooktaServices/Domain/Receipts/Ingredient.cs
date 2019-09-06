using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CooktaServices.Domain.Receipts
{
    public class Ingredient
    {
        [Key]
        public Guid Id { get; set; }
        public Unit Unit { get; set; }
        public IngredientType Type { get; set; }
        public float Value { get; set; }


        [ForeignKey("FoodId")]
        public Food Food { get; set; }
        public Guid FoodId { get; set; }
    }
}