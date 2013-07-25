using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using WebMatrix.WebData;

namespace MvcMovie.Controllers
{
    public class EveApiController : Controller
    {
        EveApi eveApi = new EveApi();
        private EveApiContext db = new EveApiContext();

        public ActionResult Index()
        {
            if (!WebSecurity.IsAuthenticated)
                return RedirectToAction("Login", "Account");

            User user = db.Users.Find(WebSecurity.CurrentUserId);

            if (user == null)
                return RedirectToAction("Create");


            var characters = from m in db.Characters
                             where m.userID == user.userID
                             select m;

            return View(characters);
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
            if (!WebSecurity.IsAuthenticated)
                throw new Exception("User is not authenticated!");

            long charid = XmlConvert.ToInt64(characterid);

            var userId = WebSecurity.GetUserId(User.Identity.Name);

            var transactions = (from t in db.WalletTransactions
                                where t.characterID == charid
                                orderby t.price descending
                                select new { t.price, t.typeName }).Take(10);
            string content = "[['typeName', 'Price']";

            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";
            foreach (var t in transactions)
            {
                content += string.Format(",['{0}', {1} ]", t.typeName, t.price.ToString(nfi));
            }
            content += "]";

            return JavaScript(content);
        }

        [HttpGet]
        public void CacheCharacterId(string characterid, string charactername)
        {
            System.Web.HttpContext.Current.Cache.Insert(WebSecurity.CurrentUserId.ToString() + "characterid", characterid);
            System.Web.HttpContext.Current.Cache.Insert(WebSecurity.CurrentUserId.ToString() + "charactername", charactername);
        }

        public ActionResult UpdateCharacters()
        {
            if (!WebSecurity.IsAuthenticated)
                throw new Exception("User is not authenticated!");

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
        public ActionResult UpdateWalletJournal(string characterID)
        {
            if (!WebSecurity.IsAuthenticated)
                throw new Exception("User is not authenticated!");

            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create");

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

            return RedirectToAction("Index");
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
        public ActionResult UpdateWalletTransactions(string characterID)
        {
            if (!WebSecurity.IsAuthenticated)
                throw new Exception("User is not authenitcated!");

            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create");

            Character character = db.Characters.Find(Convert.ToInt64(characterID));
            if (character == null)
                throw new Exception("Character not found in the database!");

            string eveResponseXmlData = eveApi.getWalletTransactions(user.keyID.ToString(), user.vCode, characterID);
            ProcessResponseWalletTransactions(character, eveResponseXmlData);

            return RedirectToAction("Index");
        }

        private void ProcessResponseWalletTransactions(Character character, string eveResponseXmlData)
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
