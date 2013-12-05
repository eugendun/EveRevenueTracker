using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace EveRevenueTracker.Controllers
{
    /// <summary>
    /// This class provides wrap methods of the Eve-Api to simplify the communication.
    /// </summary>
    public class EveApi
    {
        /// <summary>
        /// Server status of eve server.
        /// </summary>
        /// <returns>XML-Response</returns>
        public string getServerStatus()
        {
            string url = "https://api.eveonline.com/server/ServerStatus.xml.aspx";
            return getData(url);
        }

        /// <summary>
        /// Returns type name of an eve ingame item for a given id.
        /// </summary>
        /// <param name="id">Is the typeID of the item.</param>
        /// <returns>XML-Response</returns>
        public string getType(string id)
        {
            if (string.Empty == id)
                throw new ArgumentException("An empty string is given.", "id");

            string url = "https://api.eveonline.com/eve/TypeName.xml.aspx";
            return getData(url, new List<string> { "ids=" + id });
        }

        /// <summary>
        /// Returns a list of item types.
        /// </summary>
        /// <param name="ids">List of typeIDs of the items.</param>
        /// <returns>XML-Response with item types.</returns>
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

        /// <summary>
        /// Returns a list of characters.
        /// </summary>
        /// <param name="keyID">The ID of the Customizable API Key for authentication.</param>
        /// <param name="vCode">The user defined or CCP generated Verificatioin Code for the Customizable API Key.</param>
        /// <returns>XML-Response with a character list.</returns>
        public string getCharacters(string keyID, string vCode)
        {
            string url = "https://api.eveonline.com/account/Characters.xml.aspx";
            return getData(url, new List<string> { "keyID=" + keyID, "vCode=" + vCode });
        }

        /// <summary>
        /// Returns a list of market orders for a character.
        /// </summary>
        /// <param name="keyID">The ID of the Customizable API Key for authentication.The ID of the Customizable API Key for authentication.</param>
        /// <param name="vCode">The user defined or CCP generated Verificatioin Code for the Customizable API Key.</param>
        /// <param name="characterID">The ID of the character.</param>
        /// <returns>XML-Response with a list of market orders.</returns>
        public string getMarketOrders(string keyID, string vCode, string characterID)
        {
            string url = "https://api.eveonline.com/char/MarketOrders.xml.aspx";
            return getData(url, new List<string> { "keyID=" + keyID, "vCode=" + vCode, "characterID=" + characterID });
        }

        /// <summary>
        /// Returns market transactions for a character.
        /// </summary>
        /// <param name="keyID">The ID of the Customizable API Key for authentication.The ID of the Customizable API Key for authentication.</param>
        /// <param name="vCode">The user defined or CCP generated Verificatioin Code for the Customizable API Key.</param>
        /// <param name="characterID">The ID of the character.</param>
        /// <param name="fromID">TransactionID that is used for walking the transactions log backwards to get more entries.</param>
        /// <param name="rowCount">Amount of rows to return. Default is 1000. Maximum is 2560.</param>
        /// <returns>XML-Response with transactions.</returns>
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

        /// <summary>
        /// Returns journal transactions for a character
        /// </summary>
        /// <param name="keyID">The ID of the Customizable API Key for authentication.The ID of the Customizable API Key for authentication.</param>
        /// <param name="vCode">The user defined or CCP generated Verificatioin Code for the Customizable API Key.</param>
        /// <param name="characterID">The ID of the character.</param>
        /// <param name="fromID">Used for walking the journal backwards to get more entries.</param>
        /// <param name="rowCount">Amount of rows to return. Default is 50. Maximum is 2560.</param>
        /// <returns>XML-Response with journal entries.</returns>
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

        /// <summary>
        /// Returns a list of error codes that can be returned by the EVE API servers. See http://wiki.eve-id.net/APIv2_Eve_ErrorList_XML
        /// for more info.
        /// </summary>
        /// <returns>XML-Response with error list.</returns>
        public string getErrorList()
        {
            string url = "https://api.eveonline.com/eve/ErrorList.xml.aspx";
            return getData(url);
        }

        /// <summary>
        /// This method is responsible for building the url to the EVE API severs and downloading the data
        /// in XML-Format.
        /// </summary>
        /// <param name="url">The base url of the function to the server.</param>
        /// <param name="parameters">Additional arguments for the called function</param>
        /// <returns>XML-Response in a string.</returns>
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