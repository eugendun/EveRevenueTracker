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
            return getData(url);
        }

        public string getCharacters(string keyID, string vCode)
        {
            string url = "https://api.eveonline.com/account/Characters.xml.aspx";
            return getData(url, new List<string> { 
                "keyID=" + keyID,
                "vCode=" + vCode
            });
        }

        public string getWalletTransactions()
        {
            string url = "https://api.eveonline.com/char/WalletTransactions.xml.aspx";
            List<string> parameters = new List<string>();
            parameters.Add("keyID=999390");
            parameters.Add("vCode=ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy");
            parameters.Add("characterID=...");
            return getData(url, parameters);
        }

        public string getWalletJournal()
        {
            string url = "https://api.eveonline.com/char/WalletJournal.xml.aspx";
            List<string> parameters = new List<string>();
            parameters.Add("keyID=999390");
            parameters.Add("vCode=ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy");
            parameters.Add("characterID=...");
            return getData(url, new List<string> { "keyID=999390", "vCode=ox1bvi5104jSN5vEtYO3GxkhDtmYfKm2LufHah7jp4kYgrs41t8FIzhoEKcqstiy", "characterID=..." });
        }

        public string getErrorList()
        {
            string url = "https://api.eveonline.com/eve/ErrorList.xml.aspx";
            return getData(url);
        }

        public string getData(string url, List<string> parameters = null)
        {
            if (parameters != null && parameters.Count > 0)
            {
                url += "?";
                url += parameters[0];
                for (int i = 1; i < parameters.Count; i++)
                {
                    url += "&" + parameters[i];
                }
            }

            try
            {
                WebClient client = new WebClient();
                Byte[] pageData = client.DownloadData(url);
                string pageXml = Encoding.ASCII.GetString(pageData);
                return pageXml;
            }
            catch (Exception e)
            {
                throw new Exception("EVE-API Failure: \n" 
                    + "Message: " + e.Message
                    + "Request url: " + url);
            }
        }
    }
}