﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcMovie.Controllers
{
    public class ModelViewerController : Controller
    {
        //
        // GET: /ModelViewer/

        public ActionResult Index()
        {
            return View();
        }

    }
}
