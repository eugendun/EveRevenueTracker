using MvcMovie.Filters;
using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Objects;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;
using WebMatrix.WebData;

namespace MvcMovie.Controllers
{
    [Authorize]
    [InitializeSimpleMembership]
    public class EveApiController : Controller
    {
        EveApi eveApi = new EveApi();
        private EveApiContext db = new EveApiContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SelectCharacter()
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create");

            var characters = from m in db.Characters
                             where m.userID == user.userID
                             select m;

            return PartialView(characters);
        }

        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(User user)
        {
            if (ModelState.IsValid)
            {
                db.Users.Add(user);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(User);
        }

        [HttpPost]
        public ActionResult GetTransactions(string characterid)
        {
            long charid = XmlConvert.ToInt64(characterid);
            var userId = WebSecurity.GetUserId(User.Identity.Name);

            var transactions = (from t in db.WalletTransactions
                                where t.characterID == charid
                                orderby t.transactionDateTime descending
                                select new { t.price, t.typeName }).Take(10);
            string content = "[['typeName', 'Price']";

            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";
            foreach (var t in transactions)
            {
                content += string.Format(",['{0}', {1}]", t.typeName, t.price.ToString(nfi));
            }
            content += "]";

            return JavaScript(content);
        }

        [HttpPost]
        public ActionResult GetTransactionStations(string characterId)
        {
            long charId = XmlConvert.ToInt64(characterId);

            // select all station
            // later there should be a the difference between sell stations and buy stations
            // consider transaction for last n days
            var stations = (from s in db.WalletTransactions
                            where s.characterID == charId
                            select new { station = s.stationName }).Distinct();

            string rows = string.Empty;
            foreach (var row in stations)
            {
                rows += rows == string.Empty ? string.Empty : ", ";
                rows += string.Format("['{0}']", row.station);
            }
            rows = string.Format("[{0}]", rows);

            return Content(rows);
        }

        [HttpPost]
        public ActionResult GetRevenue(string characterId, string station, string number, string days)
        {
            long charId = XmlConvert.ToInt64(characterId);

            DateTime untilDate = (from t in db.WalletTransactions
                                  where t.characterID == charId
                                  select t.transactionDateTime).Max().Subtract(TimeSpan.FromDays(Convert.ToInt32(days)));

            var transactions = from t in db.WalletTransactions
                               where t.characterID == charId
                               where t.transactionDateTime > untilDate
                               where (string.IsNullOrEmpty(station) || station == t.stationName)
                               select t;

            var sellTransactions = from t in transactions
                                   where t.transactionType == "sell"
                                   group t by new { t.typeName, t.transactionType } into g
                                   select new { g.Key.typeName, price = g.Average(entry => entry.price), number = g.Count() };

            var buyTransactions = from t in db.WalletTransactions
                                  where t.transactionType == "buy"
                                  group t by new { t.typeName, t.transactionType } into g
                                  select new { g.Key.typeName, price = g.Average(entry => entry.price), number = g.Count() };

            var revenue = from r in
                              (from s in sellTransactions
                               join b in buyTransactions on s.typeName equals b.typeName
                               select new { s.typeName, revenue = s.price - b.price })
                          orderby r.revenue descending
                          select r;

            revenue.OrderBy(r => r.revenue);

            string rows = string.Empty;
            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";
            foreach (var row in revenue.Take(Convert.ToInt32(string.IsNullOrEmpty(number) ? "20" : number)))
            {
                rows += string.Format("{0}[\"{1}\", {2}]",
                    rows == string.Empty ? string.Empty : ", ",
                    row.typeName, row.revenue.ToString(nfi));
            }
            rows = string.Format("[{0}]", rows);

            return Content(rows);
        }

        [HttpPost]
        public ActionResult GetBalance(string characterid)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                throw new Exception("User not found in the database!");

            long charId = XmlConvert.ToInt64(characterid);

            var balanceEntries = from j in db.WalletJournal
                                 where j.characterID == charId
                                 group j by new { date = EntityFunctions.TruncateTime(j.date) } into g
                                 orderby g.Key.date ascending
                                 select new { g.Key.date, balance = g.Average(entry => entry.balance) };

            var buyEntries = from j in db.WalletJournal
                             where j.characterID == charId
                             where j.amount < 0
                             group j by new { date = EntityFunctions.TruncateTime(j.date) } into g
                             orderby g.Key.date ascending
                             select new { g.Key.date, buys = g.Sum(entry => entry.amount) };

            var sellEntries = from j in db.WalletJournal
                              where j.characterID == charId
                              where j.amount > 0
                              group j by new { date = EntityFunctions.TruncateTime(j.date) } into g
                              orderby g.Key.date ascending
                              select new { g.Key.date, sells = g.Sum(entry => entry.amount) };

            var joinedEntries = from e in balanceEntries
                                join b in buyEntries on e.date equals b.date into buys
                                from eb in buys
                                join s in sellEntries on eb.date equals s.date into sells
                                from ebs in sells
                                select new { e.date, e.balance, eb.buys, ebs.sells };

            string rows = string.Empty;
            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";
            foreach (var entry in joinedEntries)
            {
                string dateString = entry.date.HasValue ? entry.date.ToString() : string.Empty;
                rows += string.Format("{0}['{1}', {2}, {3}, {4}]",
                    rows == string.Empty ? string.Empty : ", ",     // first row should not contains ','
                    DateTime.Parse(dateString).ToString("s"),       // parse datestring to iso standard
                    entry.balance.ToString(nfi),                    // number decimals seperated by '.'
                    entry.buys.ToString(nfi),
                    entry.sells.ToString(nfi));
            }
            rows = string.Format("[{0}]", rows);

            return JavaScript(rows);
        }

        [HttpGet]
        public void CacheCharacterId(string characterid, string charactername)
        {
            System.Web.HttpContext.Current.Cache.Insert(WebSecurity.CurrentUserId.ToString() + "characterid", characterid);
            System.Web.HttpContext.Current.Cache.Insert(WebSecurity.CurrentUserId.ToString() + "charactername", charactername);
        }

        public ActionResult UpdateCharacters()
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create");

            string charactersXmlData = eveApi.getCharacters(user.keyID.ToString(), user.vCode);
            XDocument doc = XDocument.Parse(charactersXmlData);
            foreach (XElement row in doc.Descendants("row"))
            {
                long characterID = Convert.ToInt64(row.Attribute("characterID").Value);
                string characterName = row.Attribute("name").Value;
                long corporationID = Convert.ToInt64(row.Attribute("corporationID").Value);
                string corporationName = row.Attribute("corporationName").Value;

                Character character = db.Characters.Find(characterID);
                if (character != null)
                {
                    character.characterName = characterName;
                    character.corparationID = corporationID;
                    character.corparationName = corporationName;
                }
                else
                {
                    db.Characters.Add(new Character
                    {
                        characterID = characterID,
                        characterName = characterName,
                        corparationID = corporationID,
                        corparationName = corporationName,
                        userID = user.userID
                    });
                }
            }
            db.SaveChanges();

            return RedirectToAction("Index");
        }

        [HttpPost]
        public void UpdateMarketOrders(string characterID)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                throw new Exception("User not found in the database!");

            long lCharID = Convert.ToInt64(characterID);

            Character character = (from c in db.Characters
                                   where c.userID == user.userID
                                   where c.characterID == lCharID
                                   select c).First();

            string eveResponseXmlData = eveApi.getMarketOrders(user.keyID.ToString(), user.vCode, characterID);
            XDocument doc = XDocument.Parse(eveResponseXmlData);

            // delete all market orders in the database as they will be updadet
            var marketOrders = from m in db.MarketOrders
                               where m.character.characterID == character.characterID
                               select m;
            foreach (MarketOrder entry in marketOrders)
            {
                db.MarketOrders.Remove(entry);
            }

            foreach (XElement row in doc.Descendants("row"))
            {
                MarketOrder newEntry = MarketOrder.createFromXMLNode(character, row);
                db.MarketOrders.Add(newEntry);
            }
            db.SaveChanges();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public void UpdateWalletJournal(string characterID)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                throw new Exception("User not found in the database!");

            Character character = db.Characters.Find(Convert.ToInt64(characterID));
            if (character == null)
                throw new Exception("Character not found in the database!");

            string fromID = "";
            string rowCount = "200";

            bool repeat = true;
            while (repeat)
            {
                string eveResponseXmlData = eveApi.getWalletJournal(user.keyID.ToString(), user.vCode, characterID, fromID, rowCount);
                XDocument doc = XDocument.Parse(eveResponseXmlData);

                ProcessResponseWalletJournal(character, doc);

                repeat = doc.Descendants("row").Count() == Convert.ToInt32(rowCount);
                if (repeat)
                {
                    fromID = Convert.ToString((from t in doc.Descendants("row")
                                               select Convert.ToInt64(t.Attribute("refID").Value)).Min());
                }
            }
        }

        private void ProcessResponseWalletJournal(Character character, XDocument response)
        {
            foreach (XElement row in response.Descendants("row"))
            {
                long refID = XmlConvert.ToInt64(row.Attribute("refID").Value);

                WalletJournalEntry entry = db.WalletJournal.Find(refID);
                if (entry == null)
                {
                    entry = WalletJournalEntry.createFromXmlNode(character, row);
                    db.WalletJournal.Add(entry);
                }
            }
            db.SaveChanges();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public void UpdateWalletTransactions(string characterID)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                throw new Exception("User not found in the database!");

            Character character = db.Characters.Find(Convert.ToInt64(characterID));
            if (character == null)
                throw new Exception("Character not found in the database!");

            string fromID = "";         // begin from today on
            string rowCount = "200";    // default row count

            bool repeat = true;
            while (repeat)
            {
                string eveResponseXmlData = eveApi.getWalletTransactions(user.keyID.ToString(), user.vCode, characterID, fromID, rowCount);
                XDocument doc = XDocument.Parse(eveResponseXmlData);

                ProcessResponseWalletTransactions(character, doc);

                repeat = doc.Descendants("row").Count() == Convert.ToInt32(rowCount);
                if (repeat)
                {
                    fromID = Convert.ToString((from t in doc.Descendants("row")
                                               select Convert.ToInt64(t.Attribute("transactionID").Value)).Min());
                }
            }
        }

        private void ProcessResponseWalletTransactions(Character character, XDocument response)
        {
            foreach (XElement row in response.Descendants("row"))
            {
                long transactionID = Convert.ToInt64(row.Attribute("transactionID").Value);
                WalletTransactionEntry entry = db.WalletTransactions.Find(transactionID);
                if (entry == null)
                {
                    entry = WalletTransactionEntry.createFromXMLNode(character, row);
                    db.WalletTransactions.Add(entry);
                }
            }
            db.SaveChanges();
        }

        [HttpPost]
        public ActionResult GetStats(string characterId)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                RedirectToAction("Create");

            Character character = db.Characters.Find(Convert.ToInt64(characterId));
            if (character == null)
                throw new Exception("Character not found in the database!");

            var transactions = from t in db.WalletTransactions
                               where t.characterID == character.characterID
                               select t;

            var journalEntries = from j in db.WalletJournal
                                 where j.characterID == character.characterID
                                 select j;


            ViewBag.amountOfTransactions = transactions.Count();
            ViewBag.oldestTransaction = transactions.Min(t => t.transactionDateTime);
            ViewBag.lastTransaction = transactions.Max(t => t.transactionDateTime);
            ViewBag.amountOfJournalEntries = journalEntries.Count();
            ViewBag.oldestJournalEntry = journalEntries.Min(j => j.date);
            ViewBag.lastJournalEntry = journalEntries.Max(j => j.date);

            return PartialView("Stats");
        }

        public ActionResult ErrorList()
        {
            string errorListXml = eveApi.getErrorList();
            XDocument doc = XDocument.Parse(errorListXml);
            foreach (XElement row in doc.Descendants("row"))
            {
                int errorCode = Convert.ToInt32(row.Attribute("errorCode").Value);
                string errorText = row.Attribute("errorText").Value;
                Error error = db.Errors.Find(errorCode);
                if (error != null)
                    error.errorText = errorText;
                else
                    db.Errors.Add(new Error { errorCode = errorCode, errorText = errorText });
                db.SaveChanges();

            }

            return RedirectToAction("Index");
        }
    }
}
