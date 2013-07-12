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

        //
        // GET: /EveApi/

        public ActionResult Index()
        {
            if (!Request.IsAuthenticated)
            {
                ContentResult res = new ContentResult();
                res.Content = "Not authenticated!";
                return res;
            }

            //WebSecurity.CurrentUserId;

            string xmlData = eveApi.getServerStatus();

            //XmlDocument doc = new XmlDocument();
            //doc.LoadXml(xmlData);

            //foreach (XmlNode row in doc.SelectNodes("//row"))
            //{
            //    string name = row.Attributes["name"].Value;

            //}

            ContentResult resData = new ContentResult();
            resData.Content = xmlData;

            //return View();
            return resData;
        }
    }
}
