namespace MvcMovie.Models.EveApiMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EveApiErrorTableAdded : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Error",
                c => new
                    {
                        errorCode = c.Int(nullable: false),
                        errorText = c.String(),
                    })
                .PrimaryKey(t => t.errorCode);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Error");
        }
    }
}
