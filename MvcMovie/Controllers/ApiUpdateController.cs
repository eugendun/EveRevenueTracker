using MvcMovie.Filters;
using MvcMovie.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;
using WebMatrix.WebData;

namespace MvcMovie.Controllers
{
    /// <summary>
    /// This controller is provides actions for data update from the Eve server.
    /// </summary>
    [Authorize]
    [InitializeSimpleMembership]
    public class ApiUpdateController : Controller
    {
        private EveApi eveApi = new EveApi();
        private EveApiContext db = new EveApiContext();

        public ActionResult Index()
        {
            return new EmptyResult();
        }

        /// <summary>
        /// This action is responsible for update the character information.
        /// If current user has no characters, then it will redirect to Create action
        /// in EveApiController.
        /// If character information update was successfull it redirect to Index action.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateCharacters()
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                return RedirectToAction("Create", "EveApiController");

            string charactersXmlData = eveApi.getCharacters(user.keyID.ToString(), user.vCode);
            XDocument doc = XDocument.Parse(charactersXmlData);
            foreach (XElement row in doc.Descendants("row"))
            {
                long characterID = Convert.ToInt64(row.Attribute("characterID").Value);
                string characterName = row.Attribute("name").Value;
                long corporationID = Convert.ToInt64(row.Attribute("corporationID").Value);
                string corporationName = row.Attribute("corporationName").Value;

                Character character = db.Characters.Find(characterID);
                if (character != null)
                {
                    character.characterName = characterName;
                    character.corparationID = corporationID;
                    character.corparationName = corporationName;
                }
                else
                {
                    db.Characters.Add(new Character
                    {
                        characterID = characterID,
                        characterName = characterName,
                        corparationID = corporationID,
                        corparationName = corporationName,
                        userID = user.userID
                    });
                }
            }
            db.SaveChanges();

            return RedirectToAction("Index", "EveApiController");
        }

        /// <summary>
        /// This action is responsible for update of market orders of a character.
        /// </summary>
        /// <param name="characterID">Id of a character.</param>
        [HttpPost]
        public ActionResult UpdateMarketOrders(long characterID)
        {
            User user = db.Users.Find(WebSecurity.CurrentUserId);
            if (user == null)
                throw new Exception("User not found in the database!");

            var characters = from c in db.Characters
                             where c.userID == user.userID
                             where c.characterID == characterID
                             select c;

            if (characters.Count() <= 0)
                return new EmptyResult();

            Character character = characters.First();

            string marketOrdersXmlData = eveApi.getMarketOrders(user.keyID.ToString(), user.vCode, characterID.ToString());
            XDocument marketOrdersXDocument = XDocument.Parse(marketOrdersXmlData);

            // delete all market orders in the database as they will be updadet
            var oldMarketOrders = from m in db.MarketOrders
                                  where m.character.characterID == character.characterID
                                  select m;
            foreach (MarketOrder order in oldMarketOrders)
            {
                db.MarketOrders.Remove(order);
            }

            List<string> itemTypeIDs = new List<string>();
            foreach (XElement row in marketOrdersXDocument.Descendants("row"))
            {
                MarketOrder order = MarketOrder.createFromXMLNode(character, row);
                db.MarketOrders.Add(order);
                string itemTypeID = order.typeID.ToString();
                if (!itemTypeIDs.Contains(itemTypeID))
                {
                    itemTypeIDs.Add(itemTypeID);
                }
            }

            string itemTypesXmlData = eveApi.getTypes(itemTypeIDs);
            XDocument itemTypesXDocument = XDocument.Parse(itemTypesXmlData);
            foreach (XElement row in itemTypesXDocument.Descendants("row"))
            {
                long itemTypeID = XmlConvert.ToInt64(row.Attribute("typeID").Value);
                string itemTypeName = row.Attribute("typeName").Value;
                ItemType itemType = db.ItemTypes.Find(itemTypeID);
                if (itemType == null)
                {
                    itemType = new ItemType();
                    itemType.typeID = itemTypeID;
                    db.ItemTypes.Add(itemType);
                }

                if (itemType.typeName != itemTypeName)
                {
                    itemType.typeName = itemTypeName;
                }
            }
            db.SaveChanges();
            return new EmptyResult();
        }
    }
}
