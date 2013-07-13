using MvcMovie.Models;
using System;
using System.Collections.Generic;
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

        public ActionResult Index()
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
                return RedirectToAction("Index");
            }
            return View(User);
        }

        public ActionResult Characters()
        {
            if (!WebSecurity.IsAuthenticated)
            {
                throw new Exception("User is not authenticated!");
            }

            var userId = WebSecurity.CurrentUserId;


            var characters = from m in db.Characters
                             where m.userID == userId
                             select m;

            return View(characters);
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

            return RedirectToAction("Characters");
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
