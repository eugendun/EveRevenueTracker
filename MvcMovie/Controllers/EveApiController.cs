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
        public ActionResult GetBalance(string characterid)
        {
            // TODO
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
                                select new { e.date, e.balance, eb.buys, ebs.sells};

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
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(charactersXmlData);
            foreach (XmlNode row in doc.SelectNodes("//row"))
            {
                long characterID = Convert.ToInt64(row.Attributes["characterID"].Value);
                string characterName = row.Attributes["name"].Value;
                long corporationID = Convert.ToInt64(row.Attributes["corporationID"].Value);
                string corporationName = row.Attributes["corporationName"].Value;

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
        //[ValidateAntiForgeryToken]
        public void UpdateWalletJournal(string characterID)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                throw new Exception("User not found in the database!");

            Character character = db.Characters.Find(Convert.ToInt64(characterID));
            if (character == null)
                throw new Exception("Character not found in the database!");


            var refIDs = from w in db.WalletJournal
                         where w.characterID == character.characterID
                         where w.date >= new DateTime(2013, 4, 1)
                         select w.refID;

            long minRefID = 0;
            if (refIDs.Count() != 0)
                minRefID = refIDs.Min();

            while (true)
            {
                string eveResponseXmlData = eveApi.getWalletJournal(user.keyID.ToString(), user.vCode, characterID, minRefID > 0 ? minRefID.ToString() : "", "200");
                ProcessResponseWalletJournal(character, eveResponseXmlData);

                refIDs = from w in db.WalletJournal
                         where w.characterID == character.characterID
                         where w.date >= new DateTime(2013, 5, 1)
                         select w.refID;

                long newMinRefID = 0;
                if (refIDs.Count() != 0)
                    newMinRefID = refIDs.Min();

                if (newMinRefID == minRefID)
                    break;
                minRefID = newMinRefID;
            }
        }

        private void ProcessResponseWalletJournal(Character character, string eveResponseXmlData)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(eveResponseXmlData);
            foreach (XmlNode row in doc.SelectNodes("//row"))
            {
                long refID = XmlConvert.ToInt64(row.Attributes["refID"].Value);

                WalletJournalEntry entry = db.WalletJournal.Find(refID);
                if (entry == null)
                {
                    entry = new WalletJournalEntry();
                    entry.Character = character;
                    entry.refID = refID;
                    entry.date = Convert.ToDateTime(row.Attributes["date"].Value);
                    entry.refTypeID = XmlConvert.ToInt64(row.Attributes["refTypeID"].Value);
                    entry.ownerName1 = row.Attributes["ownerName1"].Value;
                    entry.ownerID1 = XmlConvert.ToInt64(row.Attributes["ownerID1"].Value);
                    entry.ownerName2 = row.Attributes["ownerName2"].Value;
                    entry.ownerID2 = XmlConvert.ToInt64(row.Attributes["ownerID2"].Value);
                    entry.argName1 = row.Attributes["argName1"].Value;
                    entry.argID1 = XmlConvert.ToInt64(row.Attributes["argID1"].Value);
                    entry.amount = XmlConvert.ToDecimal(row.Attributes["amount"].Value);
                    entry.balance = XmlConvert.ToDecimal(row.Attributes["balance"].Value);
                    entry.reason = row.Attributes["reason"].Value;

                    long taxReceiverID;
                    if (long.TryParse(row.Attributes["taxReceiverID"].Value, out taxReceiverID))
                        entry.taxReceiverID = taxReceiverID;

                    decimal taxAmount;
                    if (decimal.TryParse(row.Attributes["taxAmount"].Value, out taxAmount))
                        entry.taxAmount = taxAmount;

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

            string fromID = "";                                                     // begin from today on
            string rowCount = "200";                                                // default row count
            DateTime untilDate = DateTime.Today.Subtract(TimeSpan.FromDays(60));    // compute a date one month ago
            bool repeat = true;
            while (repeat)
            {
                string eveResponseXmlData = eveApi.getWalletTransactions(user.keyID.ToString(), user.vCode, characterID, fromID, rowCount);

                XDocument doc = XDocument.Parse(eveResponseXmlData);
                if (doc.Descendants("row").Count() == 0)
                {
                    break;
                }

                long minIdFromResponse = (from t in doc.Descendants("row")
                                          select Convert.ToInt64(t.Attribute("transactionID").Value)).Min();
                long maxIdFromDb = (from t in db.WalletTransactions
                                    where t.characterID == character.characterID
                                    select t.transactionID).Max();

                SaveWalletTransactions(character, eveResponseXmlData);

                if (minIdFromResponse > maxIdFromDb)
                {
                    fromID = Convert.ToString((from t in doc.Descendants("row")
                                               select Convert.ToInt64(t.Attribute("transactionID").Value)).Min());
                    continue;
                }

                DateTime minDateFromDb = (from t in db.WalletTransactions
                                          where t.characterID == character.characterID
                                          select t.transactionDateTime).Min();

                repeat = minDateFromDb > untilDate;

                if (repeat)
                {
                    fromID = Convert.ToString((from t in db.WalletTransactions
                                               where t.characterID == character.characterID
                                               select t.transactionID).Min());
                }
            }
        }

        private void SaveWalletTransactions(Character character, string eveResponseXmlData)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(eveResponseXmlData);
            foreach (XmlNode row in doc.SelectNodes("//row"))
            {
                long transactionID = Convert.ToInt64(row.Attributes["transactionID"].Value);

                WalletTransactionEntry entry = db.WalletTransactions.Find(transactionID);
                if (entry == null)
                {
                    entry = new WalletTransactionEntry();
                    entry.Character = character;
                    entry.transactionID = transactionID;
                    entry.transactionDateTime = Convert.ToDateTime(row.Attributes["transactionDateTime"].Value);
                    entry.quantity = XmlConvert.ToInt64(row.Attributes["quantity"].Value);
                    entry.typeName = row.Attributes["typeName"].Value;
                    entry.price = XmlConvert.ToDecimal(row.Attributes["price"].Value);
                    entry.typeID = XmlConvert.ToInt64(row.Attributes["typeID"].Value);
                    entry.clientID = XmlConvert.ToInt64(row.Attributes["clientID"].Value);
                    entry.clientName = row.Attributes["clientName"].Value;
                    entry.stationID = XmlConvert.ToInt64(row.Attributes["stationID"].Value);
                    entry.stationName = row.Attributes["stationName"].Value;
                    entry.transactionType = row.Attributes["transactionType"].Value;
                    entry.transactionFor = row.Attributes["transactionFor"].Value;

                    long journalTransactionID;
                    if (long.TryParse(row.Attributes["journalTransactionID"].Value, out journalTransactionID))
                        entry.journalTransactionID = journalTransactionID;

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
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(errorListXml);
            foreach (XmlNode row in doc.SelectNodes("//row"))
            {
                int errorCode = Convert.ToInt32(row.Attributes["errorCode"].Value);
                string errorText = row.Attributes["errorText"].Value;
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
