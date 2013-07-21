using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
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

        //
        // GET: /EveApi/
        public ActionResult IndexApiKey()
        {
            if (!WebSecurity.IsAuthenticated)
            {
                throw new Exception("User is not authenticated!");
            }
            User user = db.Users.Find(WebSecurity.CurrentUserId);

            if (user == null)
            {
                return RedirectToAction("Create");
            }

            return View(user);
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
                return RedirectToAction("IndexApiKey");
            }
            return View(User);
        }

        public ActionResult Index()
        {
            if (!WebSecurity.IsAuthenticated)
            {
                throw new Exception("User is not authenticated!");
            }

            var userId = WebSecurity.GetUserId(User.Identity.Name);


            var characters = from m in db.Characters
                             where m.userID == userId
                             select m;

            return View(characters);
        }

        [HttpGet]
        public ActionResult CacheCharacterId(string characterid)
        {
            System.Web.HttpContext.Current.Cache.Insert("SelectedCharacterId", characterid);

            return RedirectToAction("Details", "Character", new { id = Convert.ToInt32(characterid) });
        }

        public ActionResult UpdateCharacters()
        {
            if (!WebSecurity.IsAuthenticated)
            {
                throw new Exception("User is not authenticated!");
            }

            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create");

            string charactersXmlData = eveApi.getCharacters(user.keyID.ToString(), user.vCode);
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(charactersXmlData);
            foreach (XmlNode row in doc.SelectNodes("//row"))
            {
                int characterID = Convert.ToInt32(row.Attributes["characterID"].Value);
                string characterName = row.Attributes["name"].Value;
                int corporationID = Convert.ToInt32(row.Attributes["corporationID"].Value);
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
            {
                throw new Exception("User is not authenticated!");
            }

            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create");

            Character character = db.Characters.Find(Convert.ToInt32(characterID));
            if (character == null)
                throw new Exception("Character not found in the database!");

            string eveResponseXmlData = eveApi.getWalletJournal(user.keyID.ToString(), user.vCode, characterID);
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(eveResponseXmlData);
            foreach (XmlNode row in doc.SelectNodes("//row"))
            {
                long refID = Convert.ToInt64(row.Attributes["refID"].Value);

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
                    {
                        entry.taxReceiverID = taxReceiverID;
                    }

                    decimal taxAmount;
                    if (decimal.TryParse(row.Attributes["taxAmount"].Value, out taxAmount))
                    {
                        entry.taxAmount = taxAmount;
                    }

                    db.WalletJournal.Add(entry);
                    db.SaveChanges();
                }
            }
            //db.SaveChanges();

            return View("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public void UpdateWalletTransactions(string characterID)
        {
            if (!WebSecurity.IsAuthenticated)
            {
                throw new Exception("User is not authenitcated!");
            }
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

            return RedirectToAction("IndexApiKey");
        }
    }
}
