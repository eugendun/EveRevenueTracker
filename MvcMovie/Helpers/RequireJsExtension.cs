using System;
using System.IO;
using System.Text;
using System.Web.Mvc;
using System.Web.Routing;

namespace MvcMovie.Helpers
{
    public static class RequireJsExtension
    {
        public static MvcHtmlString RequireJs(this HtmlHelper helper, string config, string module)
        {
            string jsLocation = "/Public/release/";
#if DEBUG
            jsLocation = "Public/js/";
#endif

            string virtFilePath = Path.Combine(jsLocation, module + ".js");
            string filePath = helper.ViewContext.HttpContext.Server.MapPath(virtFilePath);

            if (!File.Exists(filePath))
                return new MvcHtmlString(string.Empty);

            var builder = new StringBuilder();
            if (File.Exists(filePath))
            {
                builder.AppendLine("require(['" + jsLocation + config + "'], function() {");
                builder.AppendLine("    require(['" + module + "']);");
                builder.AppendLine("});");
            }

            var scriptRequireJsTag = new TagBuilder("script");
            scriptRequireJsTag.MergeAttributes(new RouteValueDictionary(new { type = "text/javascript", src = "/Scripts/require.js" }));

            var scriptConfigTag = new TagBuilder("script");
            scriptConfigTag.MergeAttributes(new RouteValueDictionary(new { type = "text/javascript" }));
            scriptConfigTag.InnerHtml = builder.ToString();

            builder.Clear();
            builder.AppendLine(scriptRequireJsTag.ToString());
            builder.AppendLine(scriptConfigTag.ToString());

            return new MvcHtmlString(builder.ToString());
        }

        public static MvcHtmlString ViewSpecificRequireJs(this HtmlHelper helper)
        {
            var action = helper.ViewContext.RouteData.Values["action"];
            var controller = helper.ViewContext.RouteData.Values["controller"];

            string config = "config.js";
            string module = string.Format("Views/{0}/{1}", controller, action);

            return helper.RequireJs(config, module);
        }
    }
}