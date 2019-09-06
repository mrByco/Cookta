using System;
using System.ComponentModel.DataAnnotations;

namespace CooktaServices.Domain.Receipts
{
    public class Unit
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double ToBase { get; set; }
        public EUnitType Type { get; set; }
    }

    public enum EUnitType
    {
        Volume, Count, Mass
    }
}