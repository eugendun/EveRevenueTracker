﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using System.Xml;

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

        public string characterName { get; set; }
        public string corparationName { get; set; }
        public long corparationID { get; set; }
        public long userID { get; set; }

        public virtual User User { get; set; }
    }

    public class RefType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long refTypeID { get; set; }

        public string refRypeName { get; set; }
    }

    public class WalletJournalEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
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

        public static WalletJournalEntry createFromXmlNode(Character character, XmlNode node)
        {
            long refID = XmlConvert.ToInt64(node.Attributes["refID"].Value);

            WalletJournalEntry entry = new WalletJournalEntry();
            entry.Character = character;
            entry.refID = refID;
            entry.date = Convert.ToDateTime(node.Attributes["date"].Value);
            entry.refTypeID = XmlConvert.ToInt64(node.Attributes["refTypeID"].Value);
            entry.ownerName1 = node.Attributes["ownerName1"].Value;
            entry.ownerID1 = XmlConvert.ToInt64(node.Attributes["ownerID1"].Value);
            entry.ownerName2 = node.Attributes["ownerName2"].Value;
            entry.ownerID2 = XmlConvert.ToInt64(node.Attributes["ownerID2"].Value);
            entry.argName1 = node.Attributes["argName1"].Value;
            entry.argID1 = XmlConvert.ToInt64(node.Attributes["argID1"].Value);
            entry.amount = XmlConvert.ToDecimal(node.Attributes["amount"].Value);
            entry.balance = XmlConvert.ToDecimal(node.Attributes["balance"].Value);
            entry.reason = node.Attributes["reason"].Value;

            long taxReceiverID;
            if (long.TryParse(node.Attributes["taxReceiverID"].Value, out taxReceiverID))
                entry.taxReceiverID = taxReceiverID;

            decimal taxAmount;
            if (decimal.TryParse(node.Attributes["taxAmount"].Value, out taxAmount))
                entry.taxAmount = taxAmount;
            return entry;
        }
    }

    public class WalletTransactionEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
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
        public long? journalTransactionID { get; set; }
        public long characterID { get; set; }

        public virtual Character Character { get; set; }
        //public virtual WalletJournalEntry WalletJournalEntry { get; set; }

        public static WalletTransactionEntry createFromXMLNode(Character character, XmlNode node)
        {
            long transactionID = Convert.ToInt64(node.Attributes["transactionID"].Value);

            WalletTransactionEntry entry = new WalletTransactionEntry();
            entry.Character = character;
            entry.transactionID = transactionID;
            entry.transactionDateTime = Convert.ToDateTime(node.Attributes["transactionDateTime"].Value);
            entry.quantity = XmlConvert.ToInt64(node.Attributes["quantity"].Value);
            entry.typeName = node.Attributes["typeName"].Value;
            entry.price = XmlConvert.ToDecimal(node.Attributes["price"].Value);
            entry.typeID = XmlConvert.ToInt64(node.Attributes["typeID"].Value);
            entry.clientID = XmlConvert.ToInt64(node.Attributes["clientID"].Value);
            entry.clientName = node.Attributes["clientName"].Value;
            entry.stationID = XmlConvert.ToInt64(node.Attributes["stationID"].Value);
            entry.stationName = node.Attributes["stationName"].Value;
            entry.transactionType = node.Attributes["transactionType"].Value;
            entry.transactionFor = node.Attributes["transactionFor"].Value;

            long journalTransactionID;
            if (long.TryParse(node.Attributes["journalTransactionID"].Value, out journalTransactionID))
                entry.journalTransactionID = journalTransactionID;
            return entry;
        }
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
            //modelBuilder.Entity<WalletTransactionEntry>()
            //    .HasRequired(p => p.WalletJournalEntry)
            //    .WithMany()
            //    .HasForeignKey(u => u.journalTransactionID).WillCascadeOnDelete(false);
        }
    }
}