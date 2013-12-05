namespace EveRevenueTracker.Models.EveApiMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EveApiMarketOrderModelAdded : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.MarketOrder",
                c => new
                    {
                        orderID = c.Long(nullable: false),
                        stationID = c.Long(nullable: false),
                        volEntered = c.Long(nullable: false),
                        volRemaining = c.Long(nullable: false),
                        minValume = c.Long(nullable: false),
                        orderState = c.Byte(nullable: false),
                        typeID = c.Long(nullable: false),
                        range = c.Long(nullable: false),
                        accountKey = c.Long(nullable: false),
                        duration = c.Long(nullable: false),
                        escrow = c.Decimal(nullable: false, precision: 18, scale: 2),
                        price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        bid = c.Boolean(nullable: false),
                        issued = c.DateTime(nullable: false),
                        character_characterID = c.Long(),
                    })
                .PrimaryKey(t => t.orderID)
                .ForeignKey("dbo.Character", t => t.character_characterID)
                .Index(t => t.character_characterID);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.MarketOrder", new[] { "character_characterID" });
            DropForeignKey("dbo.MarketOrder", "character_characterID", "dbo.Character");
            DropTable("dbo.MarketOrder");
        }
    }
}
