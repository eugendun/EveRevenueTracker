using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace MvcMovie.Controllers
{
    public class EveApi
    {
        public string getServerStatus()
        {
            string url = "https://api.eveonline.com/server/ServerStatus.xml.aspx";
            return getDataFromUrl(url);
        }

        public string getCharacters()
        {
            string url = "https://api.eveonline.com/account/Characters.xml.aspx";
            List<string> parameters = new List<string>();
            parameters.Add("keyID=999390");
            parameters.Add("vCode=ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy");
            url = attachParamsToUrl(url, parameters);
            return getDataFromUrl(url);
        }

        public string getWalletTransactions()
        {
            string url = "https://api.eveonline.com/char/WalletTransactions.xml.aspx";
            List<string> parameters = new List<string>();
            parameters.Add("keyID=999390");
            parameters.Add("vCode=ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy");
            parameters.Add("characterID=...");
            url = attachParamsToUrl(url, parameters);
            return getDataFromUrl(url);
        }

        public string getWalletJournal()
        {
            string url = "https://api.eveonline.com/char/WalletJournal.xml.aspx";
            List<string> parameters = new List<string>();
            parameters.Add("keyID=999390");
            parameters.Add("vCode=ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy");
            parameters.Add("characterID=...");
            url = attachParamsToUrl(url, parameters);
            return getDataFromUrl(url);
        }

        public string getErrorList()
        {
            string url = "https://api.eveonline.com/eve/ErrorList.xml.aspx";
            return getDataFromUrl(url);
        }

        private string getDataFromUrl(string url)
        {
            try
            {
                WebClient client = new WebClient();
                Byte[] pageData = client.DownloadData(url);
                string pageXml = Encoding.ASCII.GetString(pageData);
                return pageXml;
            }
            catch (Exception e)
            {
                throw new Exception("EVE-API Failure: \n" + e.Message);
            }
        }

        private string attachParamsToUrl(string url, List<string> parameters)
        {
            url += "?";
            if (parameters.Count > 0)
                url += parameters[0];
            for (int i = 1; i < parameters.Count; i++)
            {
                url += "&" + parameters[i];
            }

            return url;
        }
    }
}