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
