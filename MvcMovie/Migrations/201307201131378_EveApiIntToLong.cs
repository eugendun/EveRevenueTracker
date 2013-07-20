namespace MvcMovie.Models.EveApiMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class EveApiIntToLong : DbMigration
    {
        public override void Up()
        {
            DisableConstraints();

            AlterColumn("dbo.Character", "characterID", c => c.Long(nullable: false));
            AlterColumn("dbo.Character", "corparationID", c => c.Long(nullable: false));
            AlterColumn("dbo.Character", "userID", c => c.Long(nullable: false));
            AlterColumn("dbo.User", "userID", c => c.Long(nullable: false));
            AlterColumn("dbo.User", "keyID", c => c.Long(nullable: false));
            AlterColumn("dbo.Error", "errorCode", c => c.Long(nullable: false));
            AlterColumn("dbo.RefType", "refTypeID", c => c.Long(nullable: false, identity: true));
            AlterColumn("dbo.WalletJournalEntry", "refID", c => c.Long(nullable: false, identity: true));
            AlterColumn("dbo.WalletJournalEntry", "refTypeID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "ownerID1", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "ownerID2", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "argID1", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "taxReceiverID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "characterID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "transactionID", c => c.Long(nullable: false, identity: true));
            AlterColumn("dbo.WalletTransactionEntry", "quantity", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "typeID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "clientID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "stationID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "journalTransactionID", c => c.Long(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "characterID", c => c.Long(nullable: false));

            EnableConstraints();
        }

        public override void Down()
        {
            DisableConstraints();

            AlterColumn("dbo.Character", "userID", c => c.Int(nullable: false));
            AlterColumn("dbo.Character", "corparationID", c => c.Int(nullable: false));
            AlterColumn("dbo.Character", "characterID", c => c.Int(nullable: false));
            AlterColumn("dbo.User", "keyID", c => c.Int(nullable: false));
            AlterColumn("dbo.User", "userID", c => c.Int(nullable: false));
            AlterColumn("dbo.Error", "errorCode", c => c.Int(nullable: false));
            AlterColumn("dbo.RefType", "refTypeID", c => c.Int(nullable: false, identity: true));
            AlterColumn("dbo.WalletJournalEntry", "characterID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "taxReceiverID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "argID1", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "ownerID2", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "ownerID1", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "refTypeID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletJournalEntry", "refID", c => c.Int(nullable: false, identity: true));
            AlterColumn("dbo.WalletTransactionEntry", "characterID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "journalTransactionID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "stationID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "clientID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "typeID", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "quantity", c => c.Int(nullable: false));
            AlterColumn("dbo.WalletTransactionEntry", "transactionID", c => c.Int(nullable: false, identity: true));

            EnableConstraints();
        }

        private void DisableConstraints()
        {
            DropForeignKey("dbo.Character", "userID", "dbo.User");
            DropForeignKey("dbo.WalletJournalEntry", "characterID", "dbo.Character");
            DropForeignKey("dbo.WalletJournalEntry", "refTypeID", "dbo.RefType");
            DropForeignKey("dbo.WalletTransactionEntry", "characterID", "dbo.Character");
            DropForeignKey("dbo.WalletTransactionEntry", "journalTransactionID", "dbo.WalletJournalEntry");

            DropPrimaryKey("dbo.Character", new[] { "Character" });
            DropPrimaryKey("dbo.User", new[] { "User" });
            DropPrimaryKey("dbo.Error", new[] { "Error" });
            DropPrimaryKey("dbo.RefType", new[] { "RefType" });
            DropPrimaryKey("dbo.WalletJournalEntry", new[] { "WalletJournalEntry" });
            DropPrimaryKey("dbo.WalletTransactionEntry", new[] { "WalletTransactionEntry" });

            DropIndex("dbo.Character", new[] { "userID" });
            DropIndex("dbo.WalletJournalEntry", new[] { "refTypeID" });
            DropIndex("dbo.WalletJournalEntry", new[] { "characterID" });
            DropIndex("dbo.WalletTransactionEntry", new[] { "characterID" });
            DropIndex("dbo.WalletTransactionEntry", new[] { "journalTransactionID" });
        }

        private void EnableConstraints()
        {
            AddPrimaryKey("dbo.Character", new[] { "characterID" });
            AddPrimaryKey("dbo.User", new[] { "userID" });
            AddPrimaryKey("dbo.Error", new[] { "errorCode" });
            AddPrimaryKey("dbo.RefType", new[] { "refTypeID" });
            AddPrimaryKey("dbo.WalletJournalEntry", new[] { "refID" });
            AddPrimaryKey("dbo.WalletTransactionEntry", new[] { "transactionID" });

            AddForeignKey("dbo.Character", "userID", "dbo.User");
            AddForeignKey("dbo.WalletJournalEntry", "characterID", "dbo.Character");
            AddForeignKey("dbo.WalletJournalEntry", "refTypeID", "dbo.RefType");
            AddForeignKey("dbo.WalletTransactionEntry", "characterID", "dbo.Character");
            AddForeignKey("dbo.WalletTransactionEntry", "journalTransactionID", "dbo.WalletJournalEntry");

            CreateIndex("dbo.Character", new[] { "userID" });
            CreateIndex("dbo.WalletJournalEntry", new[] { "refTypeID" });
            CreateIndex("dbo.WalletJournalEntry", new[] { "characterID" });
            CreateIndex("dbo.WalletTransactionEntry", new[] { "characterID" });
            CreateIndex("dbo.WalletTransactionEntry", new[] { "journalTransactionID" });
        }
    }
}
