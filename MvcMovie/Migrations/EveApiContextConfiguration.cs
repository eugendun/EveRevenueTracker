using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

namespace MvcMovie.Migrations
{
    internal sealed class EveApiContextConfiguration : DbMigrationsConfiguration<MvcMovie.Models.EveApiContext>
    {
        public EveApiContextConfiguration()
        {
            AutomaticMigrationsEnabled = false;
            MigrationsNamespace = "MvcMovie.Models.EveApiMigrationspace";
        }

        protected override void Seed(MvcMovie.Models.EveApiContext context)
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

            var users = new List<User>
            {
                new User { userID = 1, keyID = 999390, vCode = "ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy"}
            };
            users.ForEach(u => context.Users.AddOrUpdate(u));
            context.SaveChanges();

            var characters = new List<Character>
            {
                new Character { userID = 1, characterID = 123, characterName = "testname", corparationID = 123, corparationName = "testcorpname"}
            };
            characters.ForEach(c => context.Characters.AddOrUpdate(c));
            context.SaveChanges();

            context.Database.ExecuteSqlCommand("ALTER TABLE WalletTransactionEntry ADD CONSTRAINT uc_journal UNIQUE(journalTransactionID)");
        }
    }
}