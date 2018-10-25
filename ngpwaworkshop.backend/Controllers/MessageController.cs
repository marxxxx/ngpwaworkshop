using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ngpwaworkshop.backend.Models;

namespace ngpwaworkshop.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        
        private static List<string> messageList = new List<string>();


        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return messageList;
        }


        [HttpPost]
        public void Post([FromBody]MessageModel message)
        {
            messageList.Insert(0, $"{DateTime.Now} {message.Name} sagt: {message.Message}!");
        }
    }
}
