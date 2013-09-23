namespace MvcMovie.Models.EveApiMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EveApiItemTypeModelAdded : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ItemType",
                c => new
                    {
                        typeID = c.Long(nullable: false),
                        typeName = c.String(),
                    })
                .PrimaryKey(t => t.typeID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ItemType");
        }
    }
}
