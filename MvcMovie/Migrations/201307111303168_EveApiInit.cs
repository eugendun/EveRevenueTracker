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
                        characterID = c.Int(nullable: false),
                        characterName = c.String(maxLength: 50),
                        corparationID = c.Int(nullable: false),
                        corparationName = c.String(maxLength: 100),
                        userID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.characterID)
                .ForeignKey("dbo.User", t => t.userID, cascadeDelete: true)
                .Index(t => t.userID);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        userID = c.Int(nullable: false),
                        keyID = c.Int(nullable: false),
                        vCode = c.String(),
                    })
                .PrimaryKey(t => t.userID);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.Character", new[] { "userID" });
            DropForeignKey("dbo.Character", "userID", "dbo.User");
            DropTable("dbo.User");
            DropTable("dbo.Character");
        }
    }
}
