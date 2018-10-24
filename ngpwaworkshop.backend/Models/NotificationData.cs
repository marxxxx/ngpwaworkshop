using System;
using System.Collections.Generic;
using System.Text;

namespace ngpwaworkshop.backend.Models
{
    public class NotificationData
    {
        public NotificationData(string url)
        {
            this.url = url;
        }

        public string url { get; set; }
    }
}
