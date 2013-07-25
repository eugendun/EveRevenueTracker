using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Data;
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
            //AutomaticMigrationDataLossAllowed = false;
            MigrationsNamespace = "MvcMovie.Models.EveApiMigrationspace";
        }

        protected override void Seed(MvcMovie.Models.EveApiContext context)
        {
            var users = new List<User>
            {
                new User { userID = 1, keyID = 999390, vCode = "ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy"}
            };
            users.ForEach(u => context.Users.AddOrUpdate(u));
            context.SaveChanges();
        }
    }
}