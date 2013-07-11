using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace MvcMovie.Controllers
{
    public class EveApiController : Controller
    {
        EveApi eveApi = new EveApi();

        //
        // GET: /EveApi/

        public ActionResult Index()
        {
            string xmlData = eveApi.getServerStatus();



            //XmlDocument doc = new XmlDocument();
            //doc.LoadXml(xmlData);

            //foreach (XmlNode row in doc.SelectNodes("//row"))
            //{
            //    string name = row.Attributes["name"].Value;

            //}

            ContentResult res = new ContentResult();
            res.Content = xmlData;

            //return View();
            return res;
        }
    }
}
