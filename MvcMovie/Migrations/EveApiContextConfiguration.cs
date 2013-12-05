using EveRevenueTracker.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

namespace EveRevenueTracker.Migrations
{
    internal sealed class EveApiContextConfiguration : DbMigrationsConfiguration<EveRevenueTracker.Models.EveApiContext>
    {
        public EveApiContextConfiguration()
        {
            AutomaticMigrationsEnabled = false;
            //AutomaticMigrationDataLossAllowed = false;
            MigrationsNamespace = "EveRevenueTracker.Models.EveApiMigrationspace";
        }

        protected override void Seed(EveRevenueTracker.Models.EveApiContext context)
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