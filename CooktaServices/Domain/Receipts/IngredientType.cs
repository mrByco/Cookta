using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CooktaServices.Domain.Receipts
{
    public class IngredientType
    {
        [Key]
        public Guid Id { get; set; }   
        public string Name { get; set; }
        public List<Unit> CustomUnit { get; set; }
        public bool VolumeEnabled { get; set; }
        public bool CountEnabled { get; set; }
        public bool MassEnabled { get; set; }
    }
}