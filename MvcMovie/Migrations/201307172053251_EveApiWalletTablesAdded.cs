namespace MvcMovie.Models.EveApiMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EveApiWalletTablesAdded : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RefType",
                c => new
                    {
                        refTypeID = c.Int(nullable: false, identity: true),
                        refRypeName = c.String(),
                    })
                .PrimaryKey(t => t.refTypeID);
            
            CreateTable(
                "dbo.WalletJournalEntry",
                c => new
                    {
                        refID = c.Int(nullable: false, identity: true),
                        date = c.DateTime(nullable: false),
                        refTypeID = c.Int(nullable: false),
                        ownerName1 = c.String(),
                        ownerID1 = c.Int(nullable: false),
                        ownerName2 = c.String(),
                        ownerID2 = c.Int(nullable: false),
                        argName1 = c.String(),
                        argID1 = c.Int(nullable: false),
                        amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        balance = c.Decimal(nullable: false, precision: 18, scale: 2),
                        reason = c.String(),
                        taxReceiverID = c.Int(nullable: false),
                        taxAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        characterID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.refID)
                .ForeignKey("dbo.Character", t => t.characterID, cascadeDelete: true)
                .ForeignKey("dbo.RefType", t => t.refTypeID, cascadeDelete: true)
                .Index(t => t.characterID)
                .Index(t => t.refTypeID);
            
            CreateTable(
                "dbo.WalletTransactionEntry",
                c => new
                    {
                        transactionID = c.Int(nullable: false, identity: true),
                        transactionDateTime = c.DateTime(nullable: false),
                        quantity = c.Int(nullable: false),
                        typeName = c.String(),
                        price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        typeID = c.Int(nullable: false),
                        clientID = c.Int(nullable: false),
                        clientName = c.String(),
                        stationID = c.Int(nullable: false),
                        stationName = c.String(),
                        transactionType = c.String(),
                        transactionFor = c.String(),
                        journalTransactionID = c.Int(nullable: false),
                        characterID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.transactionID)
                .ForeignKey("dbo.Character", t => t.characterID, cascadeDelete: true)
                .ForeignKey("dbo.WalletJournalEntry", t => t.journalTransactionID)
                .Index(t => t.characterID)
                .Index(t => t.journalTransactionID);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.WalletTransactionEntry", new[] { "journalTransactionID" });
            DropIndex("dbo.WalletTransactionEntry", new[] { "characterID" });
            DropIndex("dbo.WalletJournalEntry", new[] { "refTypeID" });
            DropIndex("dbo.WalletJournalEntry", new[] { "characterID" });
            DropForeignKey("dbo.WalletTransactionEntry", "journalTransactionID", "dbo.WalletJournalEntry");
            DropForeignKey("dbo.WalletTransactionEntry", "characterID", "dbo.Character");
            DropForeignKey("dbo.WalletJournalEntry", "refTypeID", "dbo.RefType");
            DropForeignKey("dbo.WalletJournalEntry", "characterID", "dbo.Character");
            DropTable("dbo.WalletTransactionEntry");
            DropTable("dbo.WalletJournalEntry");
            DropTable("dbo.RefType");
        }
    }
}
