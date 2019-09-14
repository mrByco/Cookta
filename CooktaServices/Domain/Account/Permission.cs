using System;
using System.ComponentModel.DataAnnotations;

namespace CooktaServices.Domain.Account
{
    public class Permission
    {
        [Key]
        public Guid RoleId { get; set; }
        public string PermissionString { get; set; }
    }
}