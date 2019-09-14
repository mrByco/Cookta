using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CooktaServices.Domain.Account
{
    public class Sub
    {
        [Key]
        public Guid UserId { get; set; }
        public string SubString { get; set; }
    }
}