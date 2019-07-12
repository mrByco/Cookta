namespace KuktaService
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Employee")]
    public partial class Employee
    {
        public int ID { get; set; }

        [Column(TypeName = "date")]
        public DateTime Created { get; set; }

        [Required]
        [StringLength(50)]
        public string DisplayName { get; set; }

        public Guid UUID { get; set; }

        [Column(TypeName = "text")]
        public string email { get; set; }
    }
}
