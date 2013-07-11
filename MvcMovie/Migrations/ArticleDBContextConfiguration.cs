namespace MvcMovie.Migrations
{
    using MvcMovie.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class ArticleDBContextConfiguration : DbMigrationsConfiguration<MvcMovie.Models.ArticleDBContext>
    {
        public ArticleDBContextConfiguration()
        {
            AutomaticMigrationsEnabled = false;
            MigrationsNamespace = "MvcMoview.Models.ArticleDBMigrationspace";
        }

        protected override void Seed(MvcMovie.Models.ArticleDBContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.Articles.AddOrUpdate(
                new Article
                {
                    Author = "Mustername Mustervorname",
                    Content = "Mustertext",
                },
                new Article
                {
                    Author = "Mustername Mustervorname",
                    Content = "Mustertext",
                },
                new Article
                {
                    Author = "Mustername Mustervorname",
                    Content = "Mustertext",
                }
            );
        }
    }
}
