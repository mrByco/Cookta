namespace KuktaService
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Foods
    {
        [Column(TypeName = "ntext")]
        [Required]
        public string Name { get; set; }

        public int ID { get; set; }

        [Column(TypeName = "text")]
        [Required]
        public string Desc { get; set; }

        public Guid Owner { get; set; }

        public DateTime AddDate { get; set; }
    }
}
