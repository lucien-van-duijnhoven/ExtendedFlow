using System;
using System.Collections.Generic;
using Flow.Launcher.Plugin;
using System.Net.Http;
using System.Threading.Tasks;
using System.Security;

namespace Flow.Launcher.Plugin.ExtendedFlow
{
    public class ExtendedFlow : IPlugin
    {
        private PluginInitContext _context;
        private readonly HttpClient _client = new();

        public void Init(PluginInitContext context)
        {
            _context = context;
        }

        public List<Result> Query(Query query)
        {

            // Make a http request to the server

            return new List<Result>
            {
                new ()
                {
                    Title = "Toggle siteblock",
                    SubTitle = "Reroute all the blocked sites to a black page",
                    Action = _ =>
                    {
                        ToggleSiteBlock();
                        return true;
                    }
                },
                new()
                {
                    Title = "Toggle monochrome",
                    SubTitle = "Turn on/off monochrome mode",
                    Action = _ =>
                    {
                        ToggleMonochrome();
                        return true;
                    }
                }
            };
        }

        private async void ToggleMonochrome()
        {
            var response = await _client.GetAsync("http://localhost:4000/grayscale");
            response.EnsureSuccessStatusCode();
            response.Dispose();
        }

        private async void ToggleSiteBlock()
        {
            var response = await _client.GetAsync("http://localhost:4000/block");
            response.EnsureSuccessStatusCode();
            response.Dispose();
        }
    }
}