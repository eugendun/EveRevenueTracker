using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace MvcMovie.Controllers
{
    /// <summary>
    /// This class provides wrap methods of the Eve-Api to simplify the communication.
    /// </summary>
    public class EveApi
    {
        /// <summary>
        /// Server status of eve server.
        /// </summary>
        /// <returns>Xml-Response</returns>
        public string getServerStatus()
        {
            string url = "https://api.eveonline.com/server/ServerStatus.xml.aspx";
            return getData(url);
        }

        /// <summary>
        /// Returns type name of an eve ingame item for a given id.
        /// </summary>
        /// <param name="id">Is the typeID of the item.</param>
        /// <returns>Xml-Response</returns>
        public string getType(string id)
        {
            if (string.Empty == id)
                throw new ArgumentException("An empty string is given.", "id");

            string url = "https://api.eveonline.com/eve/TypeName.xml.aspx";
            return getData(url, new List<string> { "ids=" + id });
        }

        /// <summary>
        /// Return type names of eve ingame items.
        /// </summary>
        /// <param name="ids">List of typeIDs of the items.</param>
        /// <returns>Xml-Response</returns>
        public string getTypes(List<string> ids)
        {
            if (ids.Count() <= 0)
                throw new ArgumentException("The given argument list is empty, there should be at least one id.", "ids");

            string url = "https://api.eveonline.com/eve/TypeName.xml.aspx";
            string idsAsString = string.Empty;
            foreach (string id in ids)
            {
                idsAsString += string.Format("{0}{1}", string.IsNullOrEmpty(idsAsString) ? "" : ",", id);
            }
            return getData(url, new List<string> { "ids=" + idsAsString });
        }

        public string getCharacters(string keyID, string vCode)
        {
            string url = "https://api.eveonline.com/account/Characters.xml.aspx";
            return getData(url, new List<string> { "keyID=" + keyID, "vCode=" + vCode });
        }

        public string getMarketOrders(string keyID, string vCode, string characterID)
        {
            string url = "https://api.eveonline.com/char/MarketOrders.xml.aspx";
            return getData(url, new List<string> { "keyID=" + keyID, "vCode=" + vCode, "characterID=" + characterID });
        }

        public string getWalletTransactions(string keyID, string vCode, string characterID, string fromID = "", string rowCount = "")
        {
            string url = "https://api.eveonline.com/char/WalletTransactions.xml.aspx";
            return getData(url, new List<string> { 
                "keyID="+keyID,
                "vCode="+vCode,
                "characterID="+characterID,
                "fromID="+fromID,
                "rowCount="+rowCount
            });
        }

        public string getWalletJournal(string keyID, string vCode, string characterID, string fromID = "", string rowCount = "")
        {
            string url = "https://api.eveonline.com/char/WalletJournal.xml.aspx";
            return getData(url, new List<string> { 
                "keyID="+keyID,
                "vCode="+vCode, 
                "characterID="+characterID,
                "fromID="+fromID,
                "rowCount="+rowCount
            });
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