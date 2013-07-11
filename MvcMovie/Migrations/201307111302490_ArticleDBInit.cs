namespace MvcMoview.Models.ArticleDBMigrationspace
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ArticleDBInit : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Articles",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Content = c.String(),
                        Author = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Articles");
        }
    }
}
