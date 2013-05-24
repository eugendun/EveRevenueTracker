namespace MvcMovie.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenamedColumns : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Articles", "Author", c => c.String());
            DropColumn("dbo.Articles", "Title");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Articles", "Title", c => c.String());
            AlterColumn("dbo.Articles", "author", c => c.String());
        }
    }
}
