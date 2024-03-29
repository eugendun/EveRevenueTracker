﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Linq;

namespace EveRevenueTracker.Models
{
    public class EveApiContext : DbContext
    {
        public EveApiContext()
            : base("EveApiConnection")
        {
        }

        public DbSet<Character> Characters { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Error> Errors { get; set; }
        public DbSet<RefType> RefTypes { get; set; }
        public DbSet<WalletJournalEntry> WalletJournal { get; set; }
        public DbSet<WalletTransactionEntry> WalletTransactions { get; set; }
        public DbSet<MarketOrder> MarketOrders { get; set; }
        public DbSet<ItemType> ItemTypes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            //modelBuilder.Entity<WalletTransactionEntry>()
            //    .HasRequired(p => p.WalletJournalEntry)
            //    .WithMany()
            //    .HasForeignKey(u => u.journalTransactionID).WillCascadeOnDelete(false);
        }
    }

    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long userID { get; set; }

        [Required]
        [Display(Name = "Key ID")]
        public long keyID { get; set; }

        [Required]
        [Display(Name = "Verification Code")]
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

        public static WalletJournalEntry createFromXmlNode(Character character, XElement node)
        {
            long refID = XmlConvert.ToInt64(node.Attribute("refID").Value);

            WalletJournalEntry entry = new WalletJournalEntry();
            entry.Character = character;
            entry.refID = refID;
            entry.date = Convert.ToDateTime(node.Attribute("date").Value);
            entry.refTypeID = XmlConvert.ToInt64(node.Attribute("refTypeID").Value);
            entry.ownerName1 = node.Attribute("ownerName1").Value;
            entry.ownerID1 = XmlConvert.ToInt64(node.Attribute("ownerID1").Value);
            entry.ownerName2 = node.Attribute("ownerName2").Value;
            entry.ownerID2 = XmlConvert.ToInt64(node.Attribute("ownerID2").Value);
            entry.argName1 = node.Attribute("argName1").Value;
            entry.argID1 = XmlConvert.ToInt64(node.Attribute("argID1").Value);
            entry.amount = XmlConvert.ToDecimal(node.Attribute("amount").Value);
            entry.balance = XmlConvert.ToDecimal(node.Attribute("balance").Value);
            entry.reason = node.Attribute("reason").Value;

            long taxReceiverID;
            if(long.TryParse(node.Attribute("taxReceiverID").Value, out taxReceiverID))
                entry.taxReceiverID = taxReceiverID;

            decimal taxAmount;
            if(decimal.TryParse(node.Attribute("taxAmount").Value, out taxAmount))
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

        public static WalletTransactionEntry createFromXMLNode(Character character, XElement node)
        {
            long transactionID = Convert.ToInt64(node.Attribute("transactionID").Value);

            WalletTransactionEntry entry = new WalletTransactionEntry();
            entry.Character = character;
            entry.transactionID = transactionID;
            entry.transactionDateTime = Convert.ToDateTime(node.Attribute("transactionDateTime").Value);
            entry.quantity = XmlConvert.ToInt64(node.Attribute("quantity").Value);
            entry.typeName = node.Attribute("typeName").Value;
            entry.price = XmlConvert.ToDecimal(node.Attribute("price").Value);
            entry.typeID = XmlConvert.ToInt64(node.Attribute("typeID").Value);
            entry.clientID = XmlConvert.ToInt64(node.Attribute("clientID").Value);
            entry.clientName = node.Attribute("clientName").Value;
            entry.stationID = XmlConvert.ToInt64(node.Attribute("stationID").Value);
            entry.stationName = node.Attribute("stationName").Value;
            entry.transactionType = node.Attribute("transactionType").Value;
            entry.transactionFor = node.Attribute("transactionFor").Value;

            long journalTransactionID;
            if(long.TryParse(node.Attribute("journalTransactionID").Value, out journalTransactionID))
                entry.journalTransactionID = journalTransactionID;
            return entry;
        }
    }

    public class MarketOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long orderID { get; set; }

        public long stationID { get; set; }
        public long volEntered { get; set; }
        public long volRemaining { get; set; }
        public long minValume { get; set; } // TODO: rename to minVolume!!!
        public byte orderState { get; set; }
        public long typeID { get; set; }
        public long range { get; set; }
        public long accountKey { get; set; }
        public long duration { get; set; }
        public decimal escrow { get; set; }
        public decimal price { get; set; }
        public bool bid { get; set; }
        public DateTime issued { get; set; }

        public virtual Character character { get; set; }

        public static MarketOrder createFromXMLNode(Character character, XElement node)
        {
            MarketOrder order = new MarketOrder();
            order.character = character;
            order.orderID = XmlConvert.ToInt64(node.Attribute("orderID").Value);
            order.stationID = XmlConvert.ToInt64(node.Attribute("stationID").Value);
            order.volEntered = XmlConvert.ToInt64(node.Attribute("volEntered").Value);
            order.volRemaining = XmlConvert.ToInt64(node.Attribute("volRemaining").Value);
            order.minValume = XmlConvert.ToInt64(node.Attribute("minVolume").Value);
            order.orderState = XmlConvert.ToByte(node.Attribute("orderState").Value);
            order.typeID = XmlConvert.ToInt64(node.Attribute("typeID").Value);
            order.range = XmlConvert.ToInt64(node.Attribute("range").Value);
            order.accountKey = XmlConvert.ToInt64(node.Attribute("accountKey").Value);
            order.duration = XmlConvert.ToInt64(node.Attribute("duration").Value);
            order.escrow = XmlConvert.ToDecimal(node.Attribute("escrow").Value);
            order.price = XmlConvert.ToDecimal(node.Attribute("price").Value);
            order.bid = XmlConvert.ToBoolean(node.Attribute("bid").Value);
            order.issued = Convert.ToDateTime(node.Attribute("issued").Value);
            return order;
        }
    }

    // TODO: Think about this if it needed, maybe it is better to save type names directly
    public class ItemType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long typeID { get; set; }
        public string typeName { get; set; }

        public static ItemType createFromXMLNode(XElement node)
        {
            ItemType type = new ItemType();
            type.typeID = XmlConvert.ToInt64(node.Attribute("typeID").Value);
            type.typeName = node.Attribute("typeName").Value;
            return type;
        }
    }

    public class Error
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long errorCode { get; set; }

        public string errorText { get; set; }
    }
}