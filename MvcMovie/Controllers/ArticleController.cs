using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcMovie.Controllers
{
    public class ArticleController : Controller
    {
        private ArticleDBContext db = new ArticleDBContext();

        public ActionResult Index()
        {
            return View(db.Articles.ToList());
        }

    }
}
