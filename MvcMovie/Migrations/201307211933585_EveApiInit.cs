namespace MvcMovie.Models.EveApiMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EveApiInit : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Character",
                c => new
                    {
                        characterID = c.Long(nullable: false),
                        characterName = c.String(),
                        corparationName = c.String(),
                        corparationID = c.Long(nullable: false),
                        userID = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.characterID)
                .ForeignKey("dbo.User", t => t.userID, cascadeDelete: true)
                .Index(t => t.userID);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        userID = c.Long(nullable: false),
                        keyID = c.Long(nullable: false),
                        vCode = c.String(),
                    })
                .PrimaryKey(t => t.userID);
            
            CreateTable(
                "dbo.Error",
                c => new
                    {
                        errorCode = c.Long(nullable: false),
                        errorText = c.String(),
                    })
                .PrimaryKey(t => t.errorCode);
            
            CreateTable(
                "dbo.RefType",
                c => new
                    {
                        refTypeID = c.Long(nullable: false),
                        refRypeName = c.String(),
                    })
                .PrimaryKey(t => t.refTypeID);
            
            CreateTable(
                "dbo.WalletJournalEntry",
                c => new
                    {
                        refID = c.Long(nullable: false),
                        date = c.DateTime(nullable: false),
                        refTypeID = c.Long(nullable: false),
                        ownerName1 = c.String(),
                        ownerID1 = c.Long(nullable: false),
                        ownerName2 = c.String(),
                        ownerID2 = c.Long(nullable: false),
                        argName1 = c.String(),
                        argID1 = c.Long(nullable: false),
                        amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        balance = c.Decimal(nullable: false, precision: 18, scale: 2),
                        reason = c.String(),
                        taxReceiverID = c.Long(),
                        taxAmount = c.Decimal(precision: 18, scale: 2),
                        characterID = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.refID)
                .ForeignKey("dbo.Character", t => t.characterID, cascadeDelete: true)
                .Index(t => t.characterID);
            
            CreateTable(
                "dbo.WalletTransactionEntry",
                c => new
                    {
                        transactionID = c.Long(nullable: false),
                        transactionDateTime = c.DateTime(nullable: false),
                        quantity = c.Long(nullable: false),
                        typeName = c.String(),
                        price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        typeID = c.Long(nullable: false),
                        clientID = c.Long(nullable: false),
                        clientName = c.String(),
                        stationID = c.Long(nullable: false),
                        stationName = c.String(),
                        transactionType = c.String(),
                        transactionFor = c.String(),
                        journalTransactionID = c.Long(),
                        characterID = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.transactionID)
                .ForeignKey("dbo.Character", t => t.characterID, cascadeDelete: true)
                .Index(t => t.characterID);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.WalletTransactionEntry", new[] { "characterID" });
            DropIndex("dbo.WalletJournalEntry", new[] { "characterID" });
            DropIndex("dbo.Character", new[] { "userID" });
            DropForeignKey("dbo.WalletTransactionEntry", "characterID", "dbo.Character");
            DropForeignKey("dbo.WalletJournalEntry", "characterID", "dbo.Character");
            DropForeignKey("dbo.Character", "userID", "dbo.User");
            DropTable("dbo.WalletTransactionEntry");
            DropTable("dbo.WalletJournalEntry");
            DropTable("dbo.RefType");
            DropTable("dbo.Error");
            DropTable("dbo.User");
            DropTable("dbo.Character");
        }
    }
}
