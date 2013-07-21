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
        public long userID { get; set; }

        public long keyID { get; set; }
        public string vCode { get; set; }
    }

    public class Character
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long characterID { get; set; }

        [MaxLength(50)]
        public string characterName { get; set; }

        [MaxLength(100)]
        public string corparationName { get; set; }

        public long corparationID { get; set; }
        public long userID { get; set; }

        public virtual User User { get; set; }
    }

    public class RefType
    {
        [Key]
        public long refTypeID { get; set; }

        public string refRypeName { get; set; }
    }

    public class WalletJournalEntry
    {
        [Key]
        public long refID { get; set; }

        public DateTime date { get; set; }
        public long refTypeID { get; set; }
        public string ownerName1 { get; set; }
        public long ownerID1 { get; set; }
        public string ownerName2 { get; set; }
        public long ownerID2 { get; set; }
        public string argName1 { get; set; }
        public long argID1 { get; set; }
        public decimal amount { get; set; }
        public decimal balance { get; set; }
        public string reason { get; set; }

        public long? taxReceiverID { get; set; }
        public decimal? taxAmount { get; set; }
        public long characterID { get; set; }

        public virtual Character Character { get; set; }
        //public virtual RefType RefType { get; set; }
    }

    public class WalletTransactionEntry
    {
        [Key]
        public long transactionID { get; set; }

        // TODO
        public DateTime transactionDateTime { get; set; }

        public long quantity { get; set; }
        public string typeName { get; set; }
        public decimal price { get; set; }
        public long typeID { get; set; }
        public long clientID { get; set; }
        public string clientName { get; set; }
        public long stationID { get; set; }
        public string stationName { get; set; }
        public string transactionType { get; set; }
        public string transactionFor { get; set; }
        public long journalTransactionID { get; set; }
        public long characterID { get; set; }

        public virtual Character Character { get; set; }
        public virtual WalletJournalEntry WalletJournalEntry { get; set; }
    }

    public class Error
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long errorCode { get; set; }

        public string errorText { get; set; }
    }

    public class EveApiContext : DbContext
    {
        public DbSet<Character> Characters { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Error> Errors { get; set; }
        public DbSet<RefType> RefTypes { get; set; }
        public DbSet<WalletJournalEntry> WalletJournal { get; set; }
        public DbSet<WalletTransactionEntry> WalletTransactions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Entity<WalletTransactionEntry>()
                .HasRequired(p => p.WalletJournalEntry)
                .WithMany()
                .HasForeignKey(u => u.journalTransactionID).WillCascadeOnDelete(false);
        }
    }
}