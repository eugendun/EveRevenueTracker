using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace MvcMovie.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int userID { get; set; }
        
        public int keyID { get; set; }
        public string vCode { get; set; }
    }

    public class Character
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int characterID { get; set; }

        [MaxLength(50)]
        public string characterName { get; set; }
        
        public int corparationID { get; set; }
        
        [MaxLength(100)]
        public string corparationName { get; set; }

        public int userID { get; set; }

        public virtual User User { get; set; }
    }

    public class EveApiContext : DbContext
    {
        public DbSet<Character> Characters { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}