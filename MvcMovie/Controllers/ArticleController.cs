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

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Create(FormCollection fc)
        {
            if (fc.Count != 1 || !Request.IsAuthenticated)
            {
                return HttpNotFound();
            }

            var newArticle = new Article();
            newArticle.Content = fc.GetValue(fc.GetKey(0)).AttemptedValue;
            newArticle.Author = "Eugen Dundukov";
            db.Articles.Add(newArticle);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Edit(FormCollection fc)
        {
            if (!Request.IsAuthenticated || fc.Count != 2)
            {
                return HttpNotFound();
            }

            var content = fc.GetValues(0)[0];
            var id = Convert.ToInt32(fc.GetValues(1)[0]);

            var article = db.Articles.Find(id);
            article.Content = content;
            db.SaveChanges();

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult Delete(FormCollection fc)
        {
            if (!Request.IsAuthenticated || fc.Count != 1)
            {
                return HttpNotFound();
            }
            var id = Convert.ToInt32(fc.GetValues(0)[0]);
            Article article = db.Articles.Find(id);
            db.Articles.Remove(article);
            db.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}
