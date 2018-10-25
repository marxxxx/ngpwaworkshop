using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ngpwaworkshop.backend.Models;
using WebPush;

namespace ngpwaworkshop.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private const string VAPID_PUBLIC_KEY = "BFVQxQ0d8PIczVLjSBFWxIZc0UMNnYHK7fC3tUmja2VwlLOAAKQl_pBtuv6_bfJpOAqMdC8_Pdm43Sf7SOIWYFU";
        private const string VAPID_PRIVATE_KEY = "4upxp5uL0bOz7usm9tHJpHuEF3Niytj80k1nlPkA3R0";

        private static List<string> messageList = new List<string>();
        private static List<PushInfoModel> pushInfoList = new List<PushInfoModel>();


        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return messageList;
        }


        [HttpPost]
        public void Post([FromBody]MessageModel message)
        {
            messageList.Insert(0, $"{DateTime.Now} {message.Name} sagt: {message.Message}!");
            SendPushNotifications(message);
        }

        private void SendPushNotifications(MessageModel message)
        {
            var webPushClient = new WebPushClient();
            var vapidDetails = new VapidDetails("mailto:brewmaster@dataformers.at",
                VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

            var pushMessage = new WebPushMessage(new NotificationMessage("https://icon-icons.com/icons2/1516/PNG/128/beer8_105200.png", "https://icon-icons.com/icons2/1516/PNG/128/beer8_105200.png",
            "http://localhost:8080", "Dataformers", $"{message.Name}: {message.Message}"));

            foreach (var pushInfo in pushInfoList)
            {
                try
                {

                    webPushClient.SendNotification(new PushSubscription(pushInfo.SubscriptionEndpoint, pushInfo.p256dh, pushInfo.Auth),
                        JsonConvert.SerializeObject(pushMessage), vapidDetails);
                }
                catch (Exception ex)
                {

                }

            }

        }

        [HttpPost("[action]")]
        public void RegisterPushInfo([FromBody]PushInfoModel pushInfo)
        {
            pushInfoList.Add(pushInfo);
        }

    }
}
